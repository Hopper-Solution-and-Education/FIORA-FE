import { NextApiRequest, NextApiResponse } from 'next';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { financeUseCase } from '@/features/setting/api/domain/use-cases/financeUsecase';
import {
  GetFinanceReportRequest,
  GetFinanceReportSchema,
} from '@/features/setting/data/module/finance/dto/request/GetFinanceReportRequest';

export default withAuthorization({
  GET: ['User', 'Admin', 'CS'],
  POST: ['User', 'Admin', 'CS'],
  PUT: ['User', 'Admin', 'CS'],
  DELETE: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const request: GetFinanceReportRequest = await GetFinanceReportSchema.validate(req.query);

    const data = await financeUseCase.getReport({ request, userId });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_PARTNER_SUCCESS, data));
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, error.message));
  }
}
