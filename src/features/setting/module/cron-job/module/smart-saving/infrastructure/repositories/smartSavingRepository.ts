import { prisma } from '@/config';
import { notificationRepository } from '@/features/notification/infrastructure/repositories/notificationRepository';
import {
  CronJobLog,
  CronJobStatus,
  Currency,
  TransactionType,
  TypeCronJob,
  UserRole,
} from '@prisma/client';
import { ISmartSavingRepository } from '../../domain/smartSavingRepository.interface';

class smartSavingRepository implements ISmartSavingRepository {
  constructor(private _prisma = prisma) {}
  async getSmartSavingPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    search?: string,
  ): Promise<{ items: any[]; total: number; totalSuccess: number; totalFailed: number }> {
    const skip = (page - 1) * pageSize;
    const where: any = {
      typeCronJob: TypeCronJob.SMART_SAVING_INTEREST,
    };
    const orFilter: any[] = [];
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
    // console.log('🚀 ~ getSmartSavingPaginated ~ filter?.email:', filter?.email);

    if (filter?.email) {
      if (Array.isArray(filter.email)) {
        orFilter.push(
          ...filter.email.map((email: string) => ({
            dynamicValue: { path: ['userId'], equals: email },
          })),
        );
      } else {
        where.dynamicValue = { path: ['userId'], equals: filter.email };
      }
    }
    if (filter?.tierName) {
      if (Array.isArray(filter.tierName)) {
        orFilter.push(
          ...filter.tierName.map((tierName: string) => ({
            dynamicValue: { path: ['tierName'], equals: tierName },
          })),
        );
      } else {
        orFilter.push({ dynamicValue: { path: ['tierName'], equals: filter.tierName } });
      }
    }

    if (filter?.emailUpdateBy) {
      where.updatedBy = {
        in: Array.isArray(filter.emailUpdateBy) ? filter.emailUpdateBy : [filter.emailUpdateBy],
      };
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
        updateBy: dv?.updateBy ?? 'System',
        status: log.status,
        reason: log?.reason ?? null,
        userId: dv?.userId ?? null,
      };
    });
    let searchResult = items;
    let totalAfterSearch = total;
    if (search) {
      searchResult = searchResult.filter((items) => {
        return (
          items?.email?.toLowerCase().includes(search.toLowerCase()) ||
          items?.membershipTier?.toLowerCase().includes(search.toLowerCase()) ||
          items?.updateBy?.toLowerCase().includes(search.toLowerCase())
        );
      });
      totalAfterSearch = searchResult.length;
    }
    return { items: searchResult, total: totalAfterSearch, totalSuccess, totalFailed };
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

    const userId = await this._prisma.user.findFirst({
      where: { id: smartSavingdata?.userId },
      select: { id: true },
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
        userId: userId?.id,
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
          updateBy: adminEmail?.email,
        },
        reason: data.reason,
      },
    });
    try {
      if (updateSmartSaving) {
        await notificationRepository.createBoxNotification({
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

  async getSmartSavingFilerOptions(): Promise<{
    emailOptions: { id: string; email: string }[];
    tierNameOptions: { id: string; tierName: string | null }[];
    updateByOptions: { id: string; email: string }[];
  }> {
    const emailOptions = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    const tierNameOptions = await prisma.membershipTier.findMany({
      select: {
        id: true,
        tierName: true,
      },
    });
    const updatedBy = await prisma.user.findMany({
      where: { role: UserRole.Admin },
      select: {
        id: true,
        email: true,
      },
    });
    return {
      emailOptions: emailOptions,
      tierNameOptions: tierNameOptions,
      updateByOptions: updatedBy,
    };
  }
}

export const smartSavingRepositoryInstance = new smartSavingRepository();
