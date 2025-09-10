import { membershipBenefitRepository } from '@/features/setting/api/infrastructure/repositories/memBenefitRepository';
import { tierBenefitRepository } from '@/features/setting/api/infrastructure/repositories/tierBenefitRepository';
import { membershipProgressRepository } from '@/features/setting/api/infrastructure/repositories/TierMembershipRepository';
import { walletRepository } from '@/features/setting/api/infrastructure/repositories/walletRepository';
import { IMembershipBenefitRepository } from '@/features/setting/api/repositories/memBenefitRepository.interface';
import { IMembershipProgressRepository } from '@/features/setting/api/repositories/membershipProgress.interface';
import { ITierBenefitRepository } from '@/features/setting/api/repositories/tierBenefitRepository.interface';
import { IWalletRepository } from '@/features/setting/api/repositories/walletRepository.interface';
import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { BadRequestError } from '@/shared/lib';
import { WalletType } from '@prisma/client';
import { FetchPaymentWalletParams } from '../../infrastructure/types/paymentWallet.types';

const transactionUseCaseImported = transactionUseCase;

class PaymentWalletUseCase {
  constructor(
    private membershipProgressRepository: IMembershipProgressRepository,
    private transactionRepository: ITransactionRepository,
    private walletRepository: IWalletRepository,
    private membershipBenefitRepository: IMembershipBenefitRepository,
    private tierBenefitRepository: ITierBenefitRepository,
  ) { }

  async fetchPaymentWallet(userId: string, params: FetchPaymentWalletParams) {
    const { filters, lastCursor, page, pageSize, searchParams } = params;

    const transactions = await transactionUseCaseImported.getTransactionsPagination({
      filters,
      lastCursor,
      page: page || 1,
      pageSize,
      userId,
      isInfinityScroll: true,
      searchParams,
    });

    if (!transactions) {
      throw new BadRequestError(Messages.TRANSACTION_WALLET_NOT_FOUND);
    }

    return transactions;
  }

  async fetchPaymentWalletDashboardMetrics(userId: string): Promise<any> {
    const foundUserWallet = await this.walletRepository.findWalletByType(
      WalletType.Payment,
      userId,
    );

    if (!foundUserWallet) {
      throw new BadRequestError(Messages.USER_WALLET_NOT_FOUND);
    }

    const currentMembership =
      await this.membershipProgressRepository.getCurrentMembershipProgress(userId);

    if (!currentMembership) {
      throw new BadRequestError(Messages.MEMBERSHIP_PROGRESS_OF_CURRENT_USER_NOT_FOUND);
    }

    const flexInterestBenefitAwaited =
      await this.membershipBenefitRepository.fetchMembershipBenefit(
        {
          slug: 'flexi-interest',
        },
        {
          select: {
            id: true,
          },
        },
      );

    if (!flexInterestBenefitAwaited) {
      throw new BadRequestError(Messages.MEMBERSHIP_BENEFIT_NOT_FOUND);
    }

    const flexInterestTierBenefitAwaited = await this.tierBenefitRepository.findTierBenefit(
      {
        benefitId: flexInterestBenefitAwaited.id!,
        tierId: currentMembership.tierId!,
      },
      {
        select: {
          value: true,
        },
      },
    );

    if (!flexInterestTierBenefitAwaited) {
      throw new BadRequestError(Messages.MEMBERSHIP_TIER_BENEFIT_NOT_FOUND);
    }

    const totalMovedInAggregateAwaited = this.transactionRepository.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        OR: [
          {
            type: 'Income',
            toWalletId: foundUserWallet.id,
          },
          {
            type: 'Transfer',
            toWalletId: foundUserWallet.id,
          },
        ],
      },
    });

    const totalMovedOutAggregateAwaited = this.transactionRepository.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        OR: [
          {
            type: 'Expense',
            fromWalletId: foundUserWallet.id,
          },
          {
            type: 'Transfer',
            fromWalletId: foundUserWallet.id,
          },
        ],
        fromWalletId: foundUserWallet.id,
      },
    });

    const [totalMovedInResult, totalMovedOutResult] = await Promise.all([
      totalMovedInAggregateAwaited,
      totalMovedOutAggregateAwaited,
    ]);

    const totalMovedIn = Number(totalMovedInResult['_sum']['amount']) || 0;
    const totalMovedOut = Number(totalMovedOutResult['_sum']['amount']) || 0;
    const annualFlexInterest = Number(flexInterestTierBenefitAwaited.value) || 0;

    // TODO: get total withdrawal amount
    const totalWithdrawalAmount = 0;

    const totalAvailableBalance = Number(foundUserWallet.frBalanceActive) - totalWithdrawalAmount;
    const totalFrozen = Number(foundUserWallet.frBalanceFrozen) + totalWithdrawalAmount;

    const totalBalance = totalAvailableBalance + totalFrozen;
    const accumulatedEarn = Number(foundUserWallet.accumulatedEarn) || 0;

    return {
      totalMovedIn,
      totalMovedOut,
      annualFlexInterest,
      totalBalance,
      totalAvailableBalance,
      totalFrozen,
      accumulatedEarn,
    };
  }
}

export const paymentWalletUseCase = new PaymentWalletUseCase(
  membershipProgressRepository,
  transactionRepository,
  walletRepository,
  membershipBenefitRepository,
  tierBenefitRepository,
);
