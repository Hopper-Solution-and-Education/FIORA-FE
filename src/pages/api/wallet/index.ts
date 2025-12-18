import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { WalletTypeSchema } from '@/features/setting/data/module/wallet/schemas/wallet';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { WalletType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response, userId);
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
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_WALLET_TYPE, null));
  }

  const wallet = await walletUseCase.getWalletByType(parseResult.data as WalletType, userId);

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_WALLET_SUCCESS, wallet));
}
