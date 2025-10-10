import { prisma, sendOtpVerifyWithDraw } from '@/config';

import { notificationRepository } from '@/features/notification/infrastructure/repositories/notificationRepository';
import { BadRequestError } from '@/shared/lib';
import { generateSixDigitNumber } from '@/shared/utils/common';
import { generateRefCode } from '@/shared/utils/stringHelper';
import {
  AccountType,
  DepositRequestStatus,
  FxRequestType,
  OtpType,
  TransactionType,
  WalletType,
} from '@prisma/client';
import { IWalletWithdrawRepository } from '../domain/repository/walletWithdrawRepository.interface';
import { WalletWithdrawOverview } from '../types';

class walletWithdrawRepository implements IWalletWithdrawRepository {
  constructor(private _prisma = prisma) {}
  async getWalletWithdraw(userId: string): Promise<{ data: any }> {
    const membershipBenefitDaily = await this._prisma.membershipBenefit.findFirst({
      where: { slug: 'moving-daily-limit' },
      select: { id: true },
    });

    const membershipBenefitOnetime = await this._prisma.membershipBenefit.findFirst({
      where: { slug: 'moving-1-time-limit' },
      select: { id: true },
    });

    const membershipProgress = await this._prisma.membershipProgress.findFirst({
      where: {
        userId: userId,
      },
      select: {
        tierId: true,
      },
    });

    const walletPayment = await this._prisma.wallet.findFirst({
      where: { userId: userId, type: WalletType.Payment },
      select: {
        id: true,
      },
    });

    const bankAccount = await this._prisma.bankAccount.findFirst({
      where: { userId: userId },
      select: {
        id: true,
        accountNumber: true,
        accountName: true,
      },
    });

    const account = await this._prisma.account.findFirst({
      where: { userId: userId, type: AccountType.Payment },
      select: {
        id: true,
      },
    });

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const countDepositRequest = await this._prisma.depositRequest.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        type: FxRequestType.WITHDRAW,
        status: DepositRequestStatus.Requested,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const countTransaction = await this._prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        fromWalletId: walletPayment?.id,
        toAccountId: account?.id,
        type: TransactionType.Transfer,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const daily_moving_limit = await this._prisma.tierBenefit.findFirst({
      where: {
        tierId: membershipProgress?.tierId ?? undefined,
        benefitId: membershipBenefitDaily?.id,
      },
    });

    const onetime_moving_limit = await this._prisma.tierBenefit.findFirst({
      where: {
        tierId: membershipProgress?.tierId ?? undefined,
        benefitId: membershipBenefitOnetime?.id,
      },
    });

    const available_limit =
      Number(daily_moving_limit?.value ?? 0) -
      (Number(countTransaction._sum.amount ?? 0) + Number(countDepositRequest._sum.amount ?? 0));

    return {
      data: {
        daily_moving_limit: Number(daily_moving_limit?.value ?? 0),
        onetime_moving_limit: Number(onetime_moving_limit?.value ?? 0),
        available_limit: Math.max(Number(available_limit ?? 0), 0),
        moved_amount:
          Number(countTransaction?._sum?.amount ?? 0) +
          Number(countDepositRequest?._sum?.amount ?? 0),
        bankAccount: {
          accountNumber: bankAccount?.accountNumber ?? null,
          accountName: bankAccount?.accountName ?? null,
        },
      } satisfies WalletWithdrawOverview,
    };
  }
  async createWithdraw(userId: string, amount: number, otp: string): Promise<{ data: any }> {
    try {
      const verify_otp = await this._prisma.otp.findFirst({
        where: {
          AND: [{ userId: userId }, { otp: otp }],
        },
      });

      if (!verify_otp) {
        throw new BadRequestError('OTP Incorrect');
      }
      const walletPayment = await this._prisma.wallet.findFirst({
        where: { userId: userId, type: WalletType.Payment },
        select: {
          frBalanceActive: true,
          frBalanceFrozen: true,
          id: true,
        },
      });

      if (walletPayment?.frBalanceActive.lessThan(amount)) {
        throw new BadRequestError('Insufficient balance');
      }
      const membershipBenefitDaily = await this._prisma.membershipBenefit.findFirst({
        where: { slug: 'moving-daily-limit' },
        select: { id: true },
      });
      const membershipProgress = await this._prisma.membershipProgress.findFirst({
        where: {
          userId: userId,
        },
        select: {
          tierId: true,
        },
      });

      const walletPaymentData = await this._prisma.wallet.findFirst({
        where: { userId: userId, type: WalletType.Payment },
        select: {
          id: true,
        },
      });
      const account = await this._prisma.account.findFirst({
        where: { userId: userId, type: AccountType.Payment },
        select: {
          id: true,
        },
      });

      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const countDepositRequest = await this._prisma.depositRequest.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId: userId,
          type: FxRequestType.WITHDRAW,
          status: DepositRequestStatus.Requested,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const countTransaction = await this._prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          fromWalletId: walletPaymentData?.id,
          toAccountId: account?.id,
          type: TransactionType.Transfer,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const daily_moving_limit = await this._prisma.tierBenefit.findFirst({
        where: {
          tierId: membershipProgress?.tierId ?? undefined,
          benefitId: membershipBenefitDaily?.id,
        },
      });
      const totalWithdrawToday =
        Number(countTransaction._sum.amount ?? 0) +
        Number(countDepositRequest._sum.amount ?? 0) +
        Number(amount);
      const dailyLimit = Number(daily_moving_limit?.value ?? 0);

      if (totalWithdrawToday > dailyLimit) {
        throw new BadRequestError('Exceeded the allowable daily withdrawal limit');
      }

      const result = await this._prisma.wallet.update({
        where: { id: walletPayment?.id },
        data: {
          frBalanceActive: { decrement: amount },
          frBalanceFrozen: { increment: amount },
        },
      });

      const createDepositRequest = await this._prisma.depositRequest.create({
        data: {
          userId: userId,
          refCode: generateRefCode(6),
          status: DepositRequestStatus.Requested,
          type: FxRequestType.WITHDRAW,
          amount: amount,
          currency: 'USD',
        },
      });

      const emailUser = await this._prisma.user.findFirst({
        where: { id: userId },
        select: {
          email: true,
        },
      });

      if (createDepositRequest) {
        await notificationRepository.createBoxNotification({
          title: 'WITHDRAW_REQUEST',
          type: 'WITHDRAW_REQUEST',
          notifyTo: 'PERSONAL',
          attachmentId: '',
          deepLink: '',
          emails: [emailUser?.email ?? ''],
          message: `You have made a withdrawal request for the amount of ${amount} to your bank account.`,
        });
      }
      return {
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendOtpWithDraw(userId: string): Promise<{ data: any }> {
    const bankAccount = await this._prisma.bankAccount.findFirst({
      where: { userId: userId },
      select: {
        id: true,
        accountNumber: true,
        accountName: true,
      },
    });
    const userName = await this._prisma.user.findFirst({
      where: { id: userId },
      select: {
        email: true,
      },
    });
    const random6Digits = generateSixDigitNumber();
    await sendOtpVerifyWithDraw(userName?.email, random6Digits, bankAccount);
    const data = await prisma.otp.create({
      data: {
        type: OtpType.WITHDRAW,
        duration: '120',
        otp: random6Digits.toString(),
        userId: userId,
        createdAt: new Date(),
        id: crypto.randomUUID(),
      },
    });
    return {
      data: data,
    };
  }
}

export const walletWithdrawRepo = new walletWithdrawRepository();
