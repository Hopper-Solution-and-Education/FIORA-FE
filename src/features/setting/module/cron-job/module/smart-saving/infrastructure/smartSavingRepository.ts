import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { CronJobLog, CronJobStatus, Currency, TransactionType, TypeCronJob } from '@prisma/client';
import { ISmartSavingRepository } from '../domain/smartSavingRepository.interface';

class smartSavingRepository implements ISmartSavingRepository {
  constructor(private _prisma = prisma) {}
  async getSmartSavingPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    // search?: string,
  ): Promise<{ items: any[]; total: number; totalSuccess: number; totalFailed: number }> {
    const skip = (page - 1) * pageSize;
    const where: any = {
      typeCronJob: TypeCronJob.SMART_SAVING_INTEREST,
    };
    const orFilter: any[] = [];
    if (filter?.search) {
      where.OR = [
        { dynamicValue: { path: ['email'], string_contains: filter?.search, mode: 'insensitive' } },
        {
          dynamicValue: {
            path: ['tierName'],
            string_contains: filter?.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    if (filter?.status) {
      where.status = {
        in: Array.isArray(filter.status) ? filter.status : [filter.status],
      };
    }
    if (filter?.fromDate && filter?.toDate) {
      where.createdAt = {
        gte: new Date(filter.fromDate + 'T00:00:00.000Z'),
        lte: new Date(filter.toDate + 'T23:59:59.999Z'),
      };
    } else if (filter?.fromDate) {
      where.createdAt = {
        gte: new Date(filter.fromDate + 'T00:00:00.000Z'),
      };
    } else if (filter?.toDate) {
      where.createdAt = {
        lte: new Date(filter.toDate + 'T23:59:59.999Z'),
      };
    }
    if (filter?.email) {
      if (Array.isArray(filter.email)) {
        orFilter.push(
          ...filter.email.map((email: string) => ({
            dynamicValue: { path: ['email'], equals: email },
          })),
        );
      } else {
        where.dynamicValue = { path: ['email'], equals: filter.email };
      }
    }
    if (filter?.membershipTier) {
      if (Array.isArray(filter.membershipTier)) {
        orFilter.push(
          ...filter.membershipTier.map((tierName: string) => ({
            dynamicValue: { path: ['tierName'], equals: tierName },
          })),
        );
      } else {
        orFilter.push({ dynamicValue: { path: ['tierName'], equals: filter.membershipTier } });
      }
    }

    if (orFilter.length > 0) {
      if (where.OR) {
        where.OR = [...where.OR, ...orFilter];
      } else {
        where.OR = orFilter;
      }
    }

    const logs = await this._prisma.cronJobLog.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      where,
    });

    // tổng số record
    const total = await this._prisma.cronJobLog.count({ where });

    const totalSuccess = await this._prisma.cronJobLog.count({
      where: { ...where, status: CronJobStatus.SUCCESSFUL },
    });
    const totalFailed = await this._prisma.cronJobLog.count({
      where: { ...where, status: CronJobStatus.FAIL },
    });
    const items = logs.map((log) => {
      const dv = log.dynamicValue as any;
      return {
        id: log.id,
        email: dv?.email ?? null,
        dateTime: log.createdAt,
        membershipTier: dv?.tierName ?? null,
        smartSavingRate: dv?.smartSavingRate ?? null,
        activeBalance: dv?.activeBalance ?? null,
        smartSavingAmount: dv?.smartSavingAmount ?? null,
        updateBy: 'System',
        status: log.status,
        reason: dv?.reason ?? null,
      };
    });

    return { items, total, totalSuccess, totalFailed };
  }

  async getSmartSavingStatistics(): Promise<{
    tierInterestAmount: Array<{
      tierName: string;
      interestAmount: string;
      percent: string;
    }>;
    totalInterestAmount: string;
  }> {
    const dataTier = await this._prisma.membershipTier.findMany({
      select: {
        tierName: true,
        id: true,
      },
    });

    const dataLog = await this._prisma.cronJobLog.findMany({
      where: { typeCronJob: TypeCronJob.SMART_SAVING_INTEREST, status: CronJobStatus.SUCCESSFUL },
      select: {
        dynamicValue: true,
      },
    });

    const interestByTier: Record<string, number> = {};
    dataLog.forEach((log) => {
      const dv: any = log.dynamicValue;
      const tierId = dv?.tierId;
      const smartSavingAmount = parseFloat(dv?.smartSavingAmount ?? '0');
      if (!tierId) return;
      interestByTier[tierId] = (interestByTier[tierId] ?? 0) + smartSavingAmount;
    });
    const totalSmartSavingAmount = Object.values(interestByTier).reduce((sum, v) => sum + v, 0);
    const tierInterestAmount = dataTier.map((tier) => {
      const amount = interestByTier[tier.id] ?? 0;
      const percent =
        totalSmartSavingAmount === 0
          ? 0
          : Math.round((amount / totalSmartSavingAmount) * 100 * 100) / 100;
      return {
        tierName: tier.tierName ?? 'No Tier',
        interestAmount: amount.toString(),
        percent: percent.toString(),
      };
    });
    return {
      tierInterestAmount,
      totalInterestAmount: totalSmartSavingAmount.toString(),
    };
  }
  async updateSmartSavingAmount(
    data: {
      amount: number;
      reason: string;
    },
    cronJobId: string,
    adminId: string,
  ): Promise<CronJobLog | null> {
    const cronJobSmartSavingData = await this._prisma.cronJobLog.findFirst({
      where: {
        id: cronJobId,
        status: CronJobStatus.FAIL,
        typeCronJob: TypeCronJob.SMART_SAVING_INTEREST,
      },
      select: {
        dynamicValue: true,
      },
    });
    const smartSavingdata: any = cronJobSmartSavingData?.dynamicValue;

    if (!smartSavingdata || !smartSavingdata.walletId) return null;

    const userId = await this._prisma.wallet.findFirst({
      where: { id: smartSavingdata?.walletId },
      select: { userId: true },
    });
    const smartSavingBenefit = await this._prisma.membershipBenefit.findFirst({
      where: { slug: 'saving-interest' },
      select: { id: true, suffix: true },
    });
    const adminEmail = await this._prisma.user.findFirst({
      where: { id: adminId },
      select: { email: true, id: true },
    });
    const createdTxn = await this._prisma.transaction.create({
      data: {
        userId: userId?.userId,
        type: TransactionType.Income,
        amount: data.amount,
        toWalletId: smartSavingdata?.walletId,
        membershipBenefitId: smartSavingBenefit?.id,
        remark: `Retrie Smart Saving Interest)`,
        currency: Currency.FX,
        isMarked: true,
      },
    });
    await this._prisma.wallet.update({
      where: { id: smartSavingdata.walletId },
      data: {
        accumReward: { increment: data.amount },
        availableReward: { increment: data.amount },
      },
    });
    const updateSmartSaving = await this._prisma.cronJobLog.update({
      where: { id: cronJobId },
      data: {
        typeCronJob: TypeCronJob.SMART_SAVING_INTEREST,
        executionTime: new Date(),
        status: CronJobStatus.SUCCESSFUL,
        transactionId: createdTxn.id,
        updatedAt: new Date(),
        updatedBy: adminEmail?.id ?? 'System',
        dynamicValue: {
          smartSavingRate: smartSavingdata?.smartSavingRate,
          email: smartSavingdata?.email,
          tierId: smartSavingdata.tierId,
          tierName: smartSavingdata.tier?.tierName,
          activeBalance: smartSavingdata.frBalanceActive,
          smartSavingAmount: data.amount.toString(),
          smartSavingRateUnit: smartSavingBenefit?.suffix,
          smartSavingAmountUnit: Currency.FX,
          reason: data.reason,
          emailAdmin: adminEmail?.email,
        },
      },
    });
    try {
      if (updateSmartSaving) {
        await notificationUseCase.createBoxNotification({
          title: 'Retrie Smart Saving Interest',
          type: 'SMART_SAVING_INTEREST',
          notifyTo: 'PERSONAL',
          attachmentId: '',
          deepLink: '',
          emails: [smartSavingdata?.email],
          message: `Your smart saving interest of ${data.amount} ${Currency.FX} has been credited to your wallet.`,
        });
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
    return updateSmartSaving;
  }
}

export const smartSavingRepositoryInstance = new smartSavingRepository();
