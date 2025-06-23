import { z } from 'zod';
import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { WalletType } from '@prisma/client';
import { createResponse, createError } from '@/shared/lib/responseUtils/createResponse';
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

export const WalletTypeSchema = z.nativeEnum(WalletType);

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { type } = req.query;
    const parseResult = WalletTypeSchema.safeParse(type);

    if (!parseResult.success) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_WALLET_TYPE);
    }

    const wallet = await walletUseCase.getWalletByType(parseResult.data as WalletType, userId);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_WALLET_SUCCESS, wallet));
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
