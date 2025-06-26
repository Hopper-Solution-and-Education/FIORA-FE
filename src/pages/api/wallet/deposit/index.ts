import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { createResponse, createError } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import { z } from 'zod';
import { DepositRequestStatus } from '@prisma/client';

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
    const { type } = req.query;
    if (!type) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT);
    }

    const parseResult = DepositRequestStatusSchema.safeParse(type);

    if (!parseResult.success) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_DEPOSIT_REQUEST_TYPE);
    }

    const depositRequests = await walletUseCase.getDepositRequestsByType(userId, parseResult.data);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get deposit requests success', depositRequests));
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
