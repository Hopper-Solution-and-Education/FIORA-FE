import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import { ReferralDashboardFilterParams } from '@/features/setting/api/infrastructure/types/dashboard.types';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { normalizeToArray } from '@/shared/utils/filterUtils';
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
  const {
    status,
    updatedBy,
    fromDate,
    toDate,
    fromTier,
    toTier,
    search,
    page = 1,
    limit = 10,
  } = req.query as ReferralDashboardFilterParams;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const filters: any = {};
  if (status) {
    const validStatuses = ['SUCCESSFUL', 'FAIL'];
    const statusArray = normalizeToArray(status as any).filter((s) => validStatuses.includes(s));
    if (statusArray.length > 0) {
      filters.status = { in: statusArray };
    }
  }

  if (updatedBy) {
    const updatedByArray = normalizeToArray(updatedBy as any);
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
  } else {
    filters.createdAt = {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
      lte: new Date(new Date().setHours(23, 59, 59, 999)),
    };
  }

  const skip = (pageNum - 1) * limitNum;

  const tierFilters = fromTier || toTier ? { fromTier, toTier } : undefined;
  const searchFilter = await dashboardRepository.searchFilter(search as string);

  if (searchFilter) {
    filters.OR = [...(filters.OR ?? []), ...(searchFilter.OR ?? [])];
  }
  const [result, counts] = await Promise.all([
    dashboardRepository.getWithFilters(filters, skip, limitNum, tierFilters),
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
}
