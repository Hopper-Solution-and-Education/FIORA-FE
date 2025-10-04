import { TransactionType } from '@/features/home/module/transaction/types';
import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { walletRepository } from '@/features/setting/api/infrastructure/repositories/walletRepository';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { CURRENCY } from '@/shared/constants';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
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

async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT + ' id', null),
        );
    }

    const savingWallet = await walletRepository.findWalletById({
      userId,
      id: req.query.id as string,
    });

    if (!savingWallet) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.PAYMENT_WALLET_NOT_FOUND);
    }

    const [moveIn, moveOut, membership] = await Promise.all([
      transactionRepository.aggregate({
        where: {
          currency: CURRENCY.FX,
          userId,
          type: { in: [TransactionType.Income, TransactionType.Transfer] },
          toWalletId: savingWallet.id,
          OR: [{ NOT: { fromWalletId: savingWallet.id } }, { fromWalletId: null }],
        },
        _sum: { amount: true },
      }),
      transactionRepository.aggregate({
        where: {
          currency: CURRENCY.FX,
          userId,
          type: { in: [TransactionType.Expense, TransactionType.Transfer] },
          fromWalletId: savingWallet.id,
          OR: [{ NOT: { toWalletId: savingWallet.id } }, { toWalletId: null }],
        },
        _sum: { amount: true },
      }),
      membershipSettingUseCase.getCurrentMembershipTier(userId),
    ]);

    const benefit = membership.currentTier.tierBenefits?.find((b) => b.name === 'Saving Interest');

    return res.status(RESPONSE_CODE.OK).json(
      createResponse(RESPONSE_CODE.OK, Messages.GET_WALLET_SUCCESS, {
        wallet: {
          id: savingWallet.id,
          type: savingWallet.type,
          balance: savingWallet.frBalanceActive,
          availableReward: savingWallet.availableReward,
          claimsedReward: savingWallet.claimsedReward,
          accumReward: savingWallet.accumReward,
        },
        moveInBalance: Number(moveIn._sum?.amount ?? 0),
        moveOutBalance: Number(moveOut._sum?.amount ?? 0),
        benefit,
      }),
    );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
