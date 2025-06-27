import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';

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
    const amount = await walletUseCase.getTotalRequestedDepositAmount(userId);

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(RESPONSE_CODE.OK, Messages.GET_FROZEN_DEPOSIT_AMOUNT_SUCCESS, { amount }),
      );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
