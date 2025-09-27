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
import { Prisma, WalletType } from '@prisma/client';
import { FetchPaymentWalletParams } from '../../infrastructure/types/paymentWallet.types';

const transactionUseCaseImported = transactionUseCase;

class PaymentWalletUseCase {
  constructor(
    private membershipProgressRepository: IMembershipProgressRepository,
    private transactionRepository: ITransactionRepository,
    private walletRepository: IWalletRepository,
    private membershipBenefitRepository: IMembershipBenefitRepository,
    private tierBenefitRepository: ITierBenefitRepository,
  ) {}

  async fetchPaymentWallet(userId: string, params: FetchPaymentWalletParams) {
    const { filters, lastCursor, page, pageSize, searchParams } = params;

    const prefetchFilters: Prisma.TransactionWhereInput = {
      OR: [
        {
          fromWallet: {
            type: WalletType.Payment,
            id: {
              not: undefined,
            },
          },
        },
        {
          toWallet: {
            type: WalletType.Payment,
            id: {
              not: undefined,
            },
          },
        },
      ],
    };

    const filtersWithPrefetch = {
      AND: [filters, prefetchFilters],
    };

    const transactions = await transactionUseCaseImported.getTransactionsPagination({
      filters: filtersWithPrefetch,
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

  async fetchMinMaxWalletAmount(userId: string) {
    const amountAggregation = await this.transactionRepository.aggregate({
      where: {
        OR: [
          {
            fromWalletId: {
              not: null,
            },
          },
          {
            toWalletId: {
              not: null,
            },
          },
        ],
        userId,
      },
      _min: {
        baseAmount: true,
      },
      _max: {
        baseAmount: true,
      },
    });

    return {
      amountMin: amountAggregation._min.baseAmount || 0,
      amountMax: amountAggregation._max.baseAmount || 10000,
    };
  }

  async fetchPaymentWalletOptions(userId: string) {
    const [filterOptions, amountRange] = await Promise.all([
      this.walletRepository.getFilterOptions(userId),
      this.fetchMinMaxWalletAmount(userId),
    ]);

    // account,category, wallet, membership,
    return {
      wallets: filterOptions.wallets ?? [],
      accounts: filterOptions.accounts ?? [],
      categories: filterOptions.categories ?? [],
      memberships: filterOptions.memberships ?? [],
      amountMin: amountRange.amountMin,
      amountMax: amountRange.amountMax,
    };
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

  async getPaymentWalletFilterOptions(userId: string, additionalFilters?: any) {
    // Get filter options for payment wallet transactions
    const prefetchFilters: Prisma.TransactionWhereInput = {
      OR: [
        {
          fromWalletId: {
            not: null,
          },
        },
        {
          toWalletId: {
            not: null,
          },
        },
      ],
      userId,
      ...(additionalFilters || {}),
    };

    // Get unique transaction types for wallet transactions
    const types = await this.transactionRepository.findManyTransactions(
      { ...prefetchFilters },
      {
        select: {
          type: true,
        },
        distinct: ['type'],
      },
    );

    // Get min and max amounts for wallet transactions
    const amountAggregation = await this.transactionRepository.aggregate({
      where: prefetchFilters,
      _min: {
        baseAmount: true,
      },
      _max: {
        baseAmount: true,
      },
    });

    return {
      types: types.map((t) => t.type),
      amountMin: amountAggregation._min.baseAmount || 0,
      amountMax: amountAggregation._max.baseAmount || 10000,
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
