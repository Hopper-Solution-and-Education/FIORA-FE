import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { DepositRequestStatus } from '@prisma/client';
import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { _PaginationResponse } from '@/shared/types/httpResponse.types';

const DepositRequestStatusSchema = z.nativeEnum(DepositRequestStatus);

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { status, page = '1', pageSize = '10' } = req.query;

    if (!status) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT);
    }

    const parseResult = DepositRequestStatusSchema.safeParse(status);
    if (!parseResult.success) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_DEPOSIT_REQUEST_TYPE);
    }

    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(pageSizeNum) || pageNum < 1 || pageSizeNum < 1) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_PAGE_OR_PAGE_SIZE);
    }

    const data = await walletUseCase.getDepositRequestsPaginated(
      userId,
      parseResult.data,
      pageNum,
      pageSizeNum,
    );

    return res.status(RESPONSE_CODE.OK).json({
      status: RESPONSE_CODE.OK,
      message: Messages.GET_DEPOSIT_REQUEST_SUCCESS,
      data,
    } as _PaginationResponse<any>);
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
