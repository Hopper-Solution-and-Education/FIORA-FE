import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import { DashboardFilterParams } from '@/features/setting/api/infrastructure/types/dashboard.types';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const {
      status,
      userIds,
      updatedBy,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query as DashboardFilterParams;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const filters: any = {};

    if (status) {
      const validStatuses = ['SUCCESSFUL', 'FAIL'];
      if (Array.isArray(status)) {
        const validStatusArray = status.filter((s) => validStatuses.includes(s));
        if (validStatusArray.length > 0) {
          filters.status = { in: validStatusArray };
        }
      } else if (validStatuses.includes(status)) {
        filters.status = status;
      }
    }

    if (userIds) {
      const userIdArray =
        typeof userIds === 'string' ? userIds.split(',').filter((id) => id.trim()) : userIds;
      if (userIdArray.length > 0 && userIdArray.length <= 50) {
        // Limit to 50 users max
        filters.createdBy = { in: userIdArray };
      }
    }

    if (updatedBy) {
      const updatedByArray =
        typeof updatedBy === 'string' ? updatedBy.split(',').filter((id) => id.trim()) : updatedBy;
      if (updatedByArray.length > 0 && updatedByArray.length <= 50) {
        filters.updatedBy = { in: updatedByArray };
      }
    }

    if (fromDate || toDate) {
      filters.createdAt = {};
      if (fromDate) {
        const fromDateObj = new Date(fromDate);
        if (!isNaN(fromDateObj.getTime())) {
          filters.createdAt.gte = fromDateObj;
        }
      }
      if (toDate) {
        const toDateObj = new Date(toDate);
        if (!isNaN(toDateObj.getTime())) {
          filters.createdAt.lte = toDateObj;
        }
      }
    }

    const skip = (pageNum - 1) * limitNum;

    const [result, counts] = await Promise.all([
      dashboardRepository.getWithFilters(filters, skip, limitNum),
      dashboardRepository.getCount(filters),
    ]);

    const { filteredCount, statusCounts } = counts;
    const totalPages = Math.ceil(filteredCount / limitNum);
    return res.status(RESPONSE_CODE.OK).json({
      status: RESPONSE_CODE.OK,
      message: Messages.GET_SUCCESS,
      data: result,
      totalPage: totalPages,
      page: pageNum,
      pageSize: limitNum,
      total: filteredCount,
      statistics: {
        statusCounts: {
          successful: statusCounts.successful,
          fail: statusCounts.fail,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to fetch dashboard data'));
  }
}
