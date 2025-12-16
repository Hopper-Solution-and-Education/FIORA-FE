import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import { ReferralDashboardFilterParams } from '@/features/setting/api/infrastructure/types/dashboard.types';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { normalizeToArray } from '@/shared/utils/filter';
import { TypeCronJob } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin'],
  POST: ['Admin'],
  PUT: ['Admin'],
  DELETE: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response);
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

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const {
    status,
    updatedBy,
    fromDate,
    toDate,
    typeBenefits,
    page = 1,
    pageSize = 10,
    emailReferrer,
    emailReferee,
    searchParam,
  } = req.body as ReferralDashboardFilterParams;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(pageSize)));

  const filters: any = {};

  if (typeBenefits) {
    const validTypeBenefits = [
      TypeCronJob.REFERRAL_CAMPAIGN,
      TypeCronJob.REFERRAL_BONUS,
      TypeCronJob.REFERRAL_KICKBACK,
    ];
    const typeBenefitsArray = normalizeToArray(typeBenefits as any).filter((t) =>
      validTypeBenefits.includes(t as any),
    );
    if (typeBenefitsArray.length > 0) {
      filters.typeCronJob = { in: typeBenefitsArray };
    }
  }

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
  }

  const emailReferralFilters = {
    referrerEmail: emailReferrer,
    referredEmail: emailReferee,
  };

  const skip = (pageNum - 1) * limitNum;

  const { data, total, totalSuccess, totalFail } = await dashboardRepository.getReferralDashboard(
    filters,
    skip,
    limitNum,
    emailReferralFilters,
    searchParam,
  );

  const totalPages = Math.ceil(total / limitNum);

  return res.status(RESPONSE_CODE.OK).json({
    status: RESPONSE_CODE.OK,
    message: Messages.GET_LIST_REFERRAL_ITEMS_SUCCESS,
    data: data,
    totalPage: totalPages,
    page: pageNum,
    pageSize: limitNum,
    total: total,
    statistics: {
      statusCounts: {
        successful: totalSuccess,
        fail: totalFail,
      },
    },
  });
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const payloadFilters = await dashboardRepository.getReferralDashboardPayloadFilters();

  return res.status(RESPONSE_CODE.OK).json({
    status: RESPONSE_CODE.OK,
    message: Messages.GET_REFERRAL_DASHBOARD_PAYLOAD_FILTERS_SUCCESS,
    data: payloadFilters,
  });
}
