import { IMembershipProgressRepository } from '@/features/setting/api/repositories/membershipProgress.interface';
import { IMembershipTierRepository } from '@/features/setting/api/repositories/membershipTierRepository';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { BadRequestError } from '@/shared/lib';
import { IWalletRepository } from '@/features/setting/api/repositories/walletRepository.interface';
import { WalletType } from '@prisma/client';
import { buildWhereClause } from '@/shared/utils';
import { membershipTierRepository } from '@/features/setting/api/infrastructure/repositories/membershipTierRepository';
import { walletRepository } from '@/features/setting/api/infrastructure/repositories/walletRepository';
import { membershipProgressRepository } from '@/features/setting/api/infrastructure/repositories/TierMembershipRepository';

class PaymentWalletUseCase {
  constructor(
    private membershipProgressRepository: IMembershipProgressRepository,
    private transactionRepository: ITransactionRepository,
    private membershipTierRepository: IMembershipTierRepository,
    private walletRepository: IWalletRepository,
  ) { }

  async fetchPaymentWallet(
    userId: string,
    searchParam: string,
    filters: any,
    last: string,
  ): Promise<any> {
    const foundUserWallet = await this.walletRepository.findWalletByType(
      WalletType.Payment,
      userId,
    );

    if (!foundUserWallet) {
      throw new BadRequestError(Messages.USER_WALLET_NOT_FOUND);
    }

    const whereClause = buildWhereClause(filters);

    const transactions = await this.transactionRepository.findManyTransactions(
      {
        OR: [
          {
            fromWalletId: foundUserWallet.id,
          },
          {
            toWalletId: foundUserWallet.id,
          },
        ],
        ...whereClause,
      },
      {
        cursor: last ? { id: last } : undefined,
        take: 10,
        skip: last ? 1 : 0,
        orderBy: {
          createdBy: 'desc',
        },
      },
    );

    if (!transactions) {
      throw new BadRequestError(Messages.TRANSACTION_NOT_FOUND);
    }

    return { transactions };
  }
}

export const paymentWalletUseCase = new PaymentWalletUseCase(
  membershipProgressRepository,
  transactionRepository,
  membershipTierRepository,
  walletRepository,
);
