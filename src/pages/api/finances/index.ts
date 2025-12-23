import { financeUseCase } from '@/features/setting/api/domain/use-cases/financeUsecase';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import {
  GetFinanceReportRequest,
  GetFinanceReportSchema,
} from '@/features/setting/data/module/finance/dto/request/GetFinanceReportRequest';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  GET: ['User', 'Admin', 'CS'],
  POST: ['User', 'Admin', 'CS'],
  PUT: ['User', 'Admin', 'CS'],
  DELETE: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response, userId);
        case 'POST':
          return POST(request, response, userId);
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
  const queryParams = {
    type: req.query.type as string,
    filter: req.query.filter as string,
  };

  const request: GetFinanceReportRequest = await GetFinanceReportSchema.validate(queryParams);

  const data = await financeUseCase.getReport({ request, userId });

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FINANCE_REPORT_SUCCESS, data));
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { ids, type } = req.body;

  if (!ids || !type) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT));
  }

  if (!Object.values(FinanceReportEnum).includes(type)) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_FINANCE_REPORT_FILTER_TYPE));
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_FINANCE_REPORT_IDS));
  }

  const result = await financeUseCase.getReportByIds({ ids, type, userId });

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FINANCE_REPORT_SUCCESS, result));
}
