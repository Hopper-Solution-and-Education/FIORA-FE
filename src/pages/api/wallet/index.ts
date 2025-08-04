import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { WalletTypeSchema } from '@/features/setting/data/module/wallet/schemas/wallet';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { WalletType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

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

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { type } = req.query;
    if (!type) {
      // Get all wallets for the user
      const wallets = await walletUseCase.getAllWalletsByUser(userId);
      return res
        .status(RESPONSE_CODE.OK)
        .json(createResponse(RESPONSE_CODE.OK, Messages.GET_WALLET_SUCCESS, wallets));
    }

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
