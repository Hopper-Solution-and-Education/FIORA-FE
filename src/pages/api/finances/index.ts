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
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';

export default withAuthorization({
  GET: ['User', 'Admin', 'CS'],
  POST: ['User', 'Admin', 'CS'],
  PUT: ['User', 'Admin', 'CS'],
  DELETE: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    case 'POST':
      return POST(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const queryParams = {
      type: req.query.type as string,
      filter: req.query.filter as string,
    };

    const request: GetFinanceReportRequest = await GetFinanceReportSchema.validate(queryParams);

    const data = await financeUseCase.getReport({ request, userId });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FINANCE_REPORT_SUCCESS, data));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.BAD_REQUEST,
          error.message || Messages.GET_FINANCE_REPORT_FAILED,
        ),
      );
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { ids, type } = req.body;

    if (!ids || !type) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT));
    }

    if (!Object.values(FinanceReportEnum).includes(type)) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_FINANCE_REPORT_FILTER_TYPE),
        );
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
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.BAD_REQUEST,
          error.message || Messages.GET_FINANCE_REPORT_FAILED,
        ),
      );
  }
}
