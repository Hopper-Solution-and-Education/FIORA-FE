import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import { DashboardFilterParams } from '@/features/setting/api/infrastructure/types/dashboard.types';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { normalizeToArray } from '@/shared/utils/filterUtils';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status, typeCronJob } = req.query as DashboardFilterParams;

    const filters: any = {};

    if (typeCronJob) {
      filters.typeCronJob = typeCronJob;
    }

    if (status) {
      const validStatuses = ['SUCCESSFUL', 'FAIL'];
      const statusArray = normalizeToArray(status as any).filter((s) => validStatuses.includes(s));
      if (statusArray.length > 0) {
        filters.status = { in: statusArray };
      }
    }

    const getAllTypeDefines = await dashboardRepository.getMembershipChart(filters);

    return res.status(RESPONSE_CODE.OK).json({
      status: RESPONSE_CODE.OK,
      message: Messages.GET_SUCCESS,
      data: getAllTypeDefines,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to fetch dashboard data'));
  }
}
