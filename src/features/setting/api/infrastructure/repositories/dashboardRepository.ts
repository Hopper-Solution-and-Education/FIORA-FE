import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { CreateBoxNotificationInput } from '@/features/notification/domain/repositories/notificationRepository.interface';
import { Messages } from '@/shared/constants';
import { BadRequestError, ConflictError } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types';
import { applyJsonInFilter, normalizeToArray } from '@/shared/utils/filter';
import { formatUnderlineString } from '@/shared/utils/stringHelper';
import {
  CronJobLog,
  CronJobStatus,
  MembershipTier,
  Prisma,
  TransactionType,
  TypeCronJob,
  WalletType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

type DynamicCronJobReferralTypes = {
  referrerUserId: string;
  referredUserId: string;
  bonusAmount: number;
  typeBenefit: string;
};

class DashboardRepository {
  async getWithFilters(
    filters: any,
    skip: number,
    take: number,
    tierFilters?: { fromTier?: string | string[]; toTier?: string | string[] },
  ) {
    if (tierFilters?.fromTier || tierFilters?.toTier) {
      const fromArray = normalizeToArray(tierFilters.fromTier);
      const toArray = normalizeToArray(tierFilters.toTier);
      applyJsonInFilter(filters, 'fromTier', fromArray);
      applyJsonInFilter(filters, 'toTier', toArray);
    }

    const logs = await prisma.cronJobLog.findMany({
      where: filters,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        transactionId: true,
        typeCronJob: true,
        executionTime: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        dynamicValue: true,
        reason: true,
      },
    });

    const creatorIds = logs
      .map((log) => log.createdBy)
      .filter((id): id is string => id !== null && typeof id === 'string' && id.length > 0);
    const updaterIds = logs
      .map((log) => log.updatedBy)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);
    const uniqueUserIds = Array.from(new Set([...creatorIds, ...updaterIds]));

    if (uniqueUserIds.length === 0) return logs;

    const creators = await prisma.user.findMany({
      where: { id: { in: uniqueUserIds } },
      select: {
        id: true,
        name: true,
        email: true,
        MembershipProgress: {
          select: {
            id: true,
            currentSpent: true,
            currentBalance: true,
            tier: {
              select: {
                id: true,
                tierName: true,
                spentMinThreshold: true,
                spentMaxThreshold: true,
              },
            },
          },
        },
      },
    });

    const creatorMap = new Map(creators.map((u) => [u.id, u]));
    const allTiers = await prisma.membershipTier.findMany({
      orderBy: [{ spentMaxThreshold: 'desc' }, { balanceMaxThreshold: 'desc' }],
    });

    const tierMap = new Map(allTiers.map((tier) => [tier.id, tier.tierName]));

    return logs.map((log) => {
      let processedData = (log as any)?.dynamicValue;

      if (log.typeCronJob === TypeCronJob.MEMBERSHIP && (log as any).dynamicValue) {
        processedData = { ...(log as any).dynamicValue };

        if (processedData?.fromTier && tierMap.has(processedData?.fromTier)) {
          processedData.fromTier = tierMap.get(processedData?.fromTier);
        }

        if (processedData?.toTier && tierMap.has(processedData?.toTier)) {
          processedData.toTier = tierMap.get(processedData?.toTier);
        }
      }

      return {
        ...log,
        dynamicValue: processedData,
        balance: creatorMap.get(log.createdBy ?? '')?.MembershipProgress[0]?.currentBalance || 0,
        spent: creatorMap.get(log.createdBy ?? '')?.MembershipProgress[0]?.currentSpent || 0,
        updatedBy: creatorMap.get(log.updatedBy ?? '') || null,
        createdBy: creatorMap.get(log?.createdBy ?? '') || null,
      };
    });
  }

  async getCount(
    filters: any,
    tierFilters?: { fromTier?: string | string[]; toTier?: string | string[] },
  ) {
    if (tierFilters?.fromTier || tierFilters?.toTier) {
      const fromArray = normalizeToArray(tierFilters.fromTier);
      const toArray = normalizeToArray(tierFilters.toTier);
      applyJsonInFilter(filters, 'fromTier', fromArray);
      applyJsonInFilter(filters, 'toTier', toArray);
    }

    const result = await prisma.cronJobLog.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      where: filters,
    });

    const statusCounts = {
      successful: 0,
      fail: 0,
      total: 0,
    };

    let filteredCount = 0;

    result.forEach((row) => {
      const count = row._count.status;
      filteredCount += count;

      if (row.status === 'SUCCESSFUL') {
        statusCounts.successful = count;
      } else if (row.status === 'FAIL') {
        statusCounts.fail = count;
      }
    });

    statusCounts.total = filteredCount;

    return {
      filteredCount,
      statusCounts,
    };
  }

  async getAllTypeDefines() {
    const result = await prisma.cronjobTypeDefine.findMany({
      orderBy: { typeCronJob: 'asc' },
      select: { typeCronJob: true, id: true, field: true, createdAt: true, updatedAt: true },
    });

    const grouped: Record<string, any[]> = {};
    for (const item of result) {
      (grouped[item.typeCronJob] ??= []).push(item);
    }
    return grouped;
  }

  async changeCronjob(
    cronjobData: CronJobLog,
    user: SessionUser,
    tier: MembershipTier,
    reason?: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.membershipProgress.findFirst({
        where: { userId: cronjobData?.createdBy || '' },
        include: {
          tier: true,
          user: true,
        },
      });

      if (
        !existing ||
        cronjobData.typeCronJob !== TypeCronJob.MEMBERSHIP
        //  ||  !this.shouldUpdateTier(cronjobData, existing)
      ) {
        return 404;
      }

      const { email, name, id: user_id } = existing.user;
      const tier_name = tier?.tierName || '';
      // const newTierId = (cronjobData.dynamicValue as any)?.['toTier'] as string;

      const updatedProgress = await tx.membershipProgress.update({
        where: { id: existing?.id },
        data: {
          updatedBy: user.id,
          updatedAt: new Date(),
          tierId: tier.id,
          tiersendid: tier.id,
        },
      });

      const status = updatedProgress ? CronJobStatus.SUCCESSFUL : CronJobStatus.FAIL;

      const updatedCronJobLog = await tx.cronJobLog.update({
        where: { id: cronjobData.id },
        data: {
          updatedBy: user.id,
          updatedAt: new Date(),
          status,
          dynamicValue: {
            fromTier: (cronjobData.dynamicValue as any)?.['fromTier'] as string,
            toTier: tier?.id,
          },
          reason: reason || '',
        },
      });

      if (status === CronJobStatus.SUCCESSFUL) {
        setImmediate(() => {
          this.sendMembershipNotification(email, name || '', tier_name, user_id).catch((error) => {
            console.error('Failed to send membership notification:', error);
          });
        });
      }
      updatedCronJobLog.updatedBy = user as any;
      return updatedCronJobLog;
    });
  }

  // private shouldUpdateTier(cronjobData: CronJobLog, existing: any): boolean {
  //   const newTierId = (cronjobData.dynamicValue as any)?.['toTier']?.toString();
  //   const currentTierId = existing.tierId?.toString();
  //   return newTierId && newTierId !== currentTierId;
  // }

  private async sendMembershipNotification(
    email: string,
    username: string,
    tier_name: string,
    user_id: string,
  ) {
    const notificationData: CreateBoxNotificationInput = {
      title: 'FIORA Membership Tier Change Notification',
      type: 'MEMBERSHIP',
      notifyTo: 'ROLE_USER',
      attachmentId: '',
      deepLink: '',
      message: 'Your FIORA Membership Tier Has Changed!',
      emails: [email],
    };

    await notificationUseCase.createNotificationCronjob(
      notificationData,
      email,
      username,
      tier_name,
      new Date().toString(),
      user_id,
    );
  }

  async getCronjob(id: string) {
    const cronjob = await prisma.cronJobLog.findFirst({
      where: { id },
    });
    return cronjob;
  }

  async getTier(id: string) {
    const cronjob = await prisma.membershipTier.findFirst({
      where: { id },
    });
    return cronjob;
  }

  async getMembershipChart(filters?: any) {
    const cronJobWhere: any = {};

    if (filters.typeCronJob) {
      cronJobWhere.typeCronJob = filters.typeCronJob;
    }

    if (filters.OR) {
      cronJobWhere.OR = filters.OR;
    }

    const cronJobLogs = await prisma.cronJobLog.findMany({
      where: cronJobWhere,
      select: {
        dynamicValue: true,
      },
    });
    const tierIds = cronJobLogs
      .map((log) => (log.dynamicValue as any)?.toTier)
      .filter((id): id is string => id !== null && id !== undefined);

    const tierCounts = new Map<string, number>();
    tierIds.forEach((tierId) => {
      tierCounts.set(tierId, (tierCounts.get(tierId) || 0) + 1);
    });

    const tiers = await prisma.membershipTier.findMany({
      select: {
        id: true,
        tierName: true,
      },
    });

    // Build items for all tiers, defaulting count to 0 when absent
    const items = tiers.map((tier) => ({
      tierId: tier.id,
      tierName: tier.tierName,
      count: tierCounts.get(tier.id) || 0,
    }));

    const total = tierIds.length;

    return { total, items };
  }

  async searchFilter(search: string) {
    const filters: any = {};
    if (search && search.trim().length > 0) {
      const q = search.trim();
      const qUpper = q.toUpperCase();
      const statusMatches: string[] = ['SUCCESSFUL', 'FAIL'].filter((s) => s.includes(qUpper));
      const typeMatches: string[] = ['MEMBERSHIP', 'REFERRAL', 'CASHBACK', 'FLEXI_INTEREST'].filter(
        (s) => s.includes(qUpper),
      );

      const [matchedTiers, matchedUsers] = await Promise.all([
        prisma.membershipTier.findMany({
          where: { tierName: { contains: q, mode: 'insensitive' } },
          select: { id: true },
        }),
        prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
          select: { id: true },
        }),
      ]);

      const tierIds = matchedTiers.map((t) => t.id);
      const userIds = matchedUsers.map((u) => u.id);

      const orClauses: any[] = [];
      if (statusMatches.length > 0) orClauses.push({ status: { in: statusMatches as any } });
      if (typeMatches.length > 0) orClauses.push({ typeCronJob: { in: typeMatches as any } });
      if (tierIds.length > 0) {
        applyJsonInFilter({ OR: orClauses }, 'fromTier', tierIds);
        applyJsonInFilter({ OR: orClauses }, 'toTier', tierIds);
      }
      if (userIds.length > 0) {
        orClauses.push({ createdBy: { in: userIds } });
        orClauses.push({ updatedBy: { in: userIds } });
      }

      if (orClauses.length > 0) {
        filters.OR = [...(filters.OR ?? []), ...orClauses];
      }
      return filters;
    }
  }

  async getTierInterestAmount(typeCronJob: TypeCronJob) {
    const cronJobLogs = await prisma.cronJobLog.findMany({
      where: { typeCronJob, status: CronJobStatus.SUCCESSFUL },
      select: {
        createdBy: true,
        dynamicValue: true,
      },
    });

    if (!cronJobLogs.length) return { tierInterestAmount: [], totalInterestAmount: 0 };

    const userIds = cronJobLogs
      .map((log) => log.createdBy)
      .filter((id): id is string => id !== null && typeof id === 'string' && id.length > 0);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        MembershipProgress: {
          select: {
            tierId: true,
          },
        },
      },
    });

    const tierUserMap = new Map(users.map((u) => [u.id, u.MembershipProgress[0]?.tierId]));

    const tiers = await prisma.membershipTier.findMany({
      select: {
        id: true,
        tierName: true,
      },
    });

    const balanceTier = cronJobLogs.reduce<Map<string, Decimal>>((acc, log) => {
      const tierId = (log.dynamicValue as any)?.tierId ?? tierUserMap.get(log.createdBy ?? '');
      const amount =
        typeCronJob === TypeCronJob.FLEXI_INTEREST
          ? new Decimal((log.dynamicValue as any)?.interestAmount ?? 0)
          : new Decimal(0);
      if (tierId) acc.set(tierId, (acc.get(tierId) ?? new Decimal(0)).add(amount));
      return acc;
    }, new Map());

    const tierInterestAmount = tiers.map((t) => ({
      tierId: t.id,
      tierName: t.tierName,
      interestAmount: balanceTier.get(t.id) ?? new Decimal(0),
    }));

    return {
      tierInterestAmount,
      totalInterestAmount: tierInterestAmount.reduce(
        (s, d) => s.add(d.interestAmount),
        new Decimal(0),
      ),
    };
  }

  async getReferralChart() {
    const referralKickbackAwait = prisma.cronJobLog.findMany({
      where: { typeCronJob: TypeCronJob.REFERRAL_KICKBACK },
      select: {
        dynamicValue: true,
      },
    });

    const referralBonusAwait = prisma.cronJobLog.findMany({
      where: { typeCronJob: TypeCronJob.REFERRAL_BONUS },
      select: {
        dynamicValue: true,
      },
    });

    const referralCampaignAwait = prisma.cronJobLog.findMany({
      where: { typeCronJob: TypeCronJob.REFERRAL_CAMPAIGN },
      select: {
        dynamicValue: true,
      },
    });

    const [referralKickback, referralBonus, referralCampaign] = await Promise.all([
      referralKickbackAwait,
      referralBonusAwait,
      referralCampaignAwait,
    ]);

    const referralKickbackValue = referralKickback.reduce(
      (acc, curr) => acc + Number((curr.dynamicValue as any)?.bonusAmount),
      0,
    );

    const referralBonusValue = referralBonus.reduce(
      (acc, curr) => acc + Number((curr.dynamicValue as any)?.bonusAmount),
      0,
    );

    const referralCampaignValue = referralCampaign.reduce(
      (acc, curr) => acc + Number((curr.dynamicValue as any)?.bonusAmount),
      0,
    );

    return { referralKickbackValue, referralBonusValue, referralCampaignValue };
  }

  async getReferralDashboard(
    filters?: any,
    skip?: number,
    take?: number,
    emailReferralFilters?: any,
    search?: string | null,
  ) {
    let where: Prisma.CronJobLogWhereInput = {
      typeCronJob: {
        in: [
          TypeCronJob.REFERRAL_CAMPAIGN,
          TypeCronJob.REFERRAL_BONUS,
          TypeCronJob.REFERRAL_KICKBACK,
        ],
      },
      ...filters,
    };

    const copyWhere = { ...where };

    const extraWhere: Prisma.CronJobLogWhereInput = {};

    if (emailReferralFilters) {
      if (emailReferralFilters.referrerEmail) {
        extraWhere.OR = emailReferralFilters.referrerEmail.map((email: string) => ({
          dynamicValue: {
            path: ['referrerUserId'],
            equals: email,
          },
        }));
      }
      if (emailReferralFilters.referredEmail) {
        extraWhere.OR = emailReferralFilters.referredEmail.map((email: string) => ({
          dynamicValue: {
            path: ['referredUserId'],
            equals: email,
          },
        }));
      }
    }

    if (extraWhere.OR) {
      // Merge extraWhere with where conditions
      where = {
        AND: [where, extraWhere],
      };
    }

    const dataResult = prisma.cronJobLog.findMany({
      where: where,
      include: {
        Transaction: true,
      },
      skip,
      take,
    });

    const totalResult = prisma.cronJobLog.count({
      where: where,
    });

    const totalSuccessResult = prisma.cronJobLog.count({
      where: {
        ...copyWhere,
        status: CronJobStatus.SUCCESSFUL,
      },
    });

    const totalFailResult = prisma.cronJobLog.count({
      where: {
        ...copyWhere,
        status: CronJobStatus.FAIL,
      },
    });

    const [data = [], total = 0, totalSuccess = 0, totalFail = 0] = await Promise.all([
      dataResult,
      totalResult,
      totalSuccessResult,
      totalFailResult,
    ]);

    const transferredData = await Promise.all(
      data.map(async (item) => {
        const dynamicValue = item.dynamicValue as DynamicCronJobReferralTypes;
        const referrerId = dynamicValue.referrerUserId;
        const referredId = dynamicValue.referredUserId;

        const foundReferrerAwaited = prisma.user.findFirst({
          where: { id: referrerId },
        });
        const foundReferredAwaited = prisma.user.findFirst({
          where: { id: referredId },
        });

        const [foundReferrer = null, foundReferred = null] = await Promise.all([
          foundReferrerAwaited,
          foundReferredAwaited,
        ]);

        let updatedByEmail = null;

        if (item.updatedBy) {
          updatedByEmail = await prisma.user.findFirst({
            where: { id: item.updatedBy },
            select: { email: true },
          });
        }

        const amount = Number(dynamicValue.bonusAmount) || 0;
        const spent = Number(item.Transaction?.amount) || 0;

        return {
          id: item.id,
          dateTime: item.executionTime,
          type: item.typeCronJob,
          status: item.status,
          updatedBy: updatedByEmail?.email || null,
          reason: item.reason || 'NaN',
          referrerEmail: foundReferrer?.email || 'NaN',
          referredEmail: foundReferred?.email || 'NaN',
          amount,
          spent,
        };
      }),
    );

    // find out emailReferrer and emailReferee & type of benefits
    let searchResult = transferredData;
    let totalCount = total;

    if (search) {
      searchResult = searchResult.filter((item) => {
        return (
          item.referrerEmail.includes(search) ||
          item.referredEmail.includes(search) ||
          item.type.includes(search)
        );
      });
      totalCount = searchResult.length;
    }

    return { data: searchResult, total: totalCount, totalSuccess, totalFail };
  }

  // return all necessarily filters metadata for referral dashboard
  async getReferralDashboardPayloadFilters() {
    const emailReferrer = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    const emailReferee = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    const updatedBy = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    const typeOfBenefits = [
      TypeCronJob.REFERRAL_CAMPAIGN,
      TypeCronJob.REFERRAL_BONUS,
      TypeCronJob.REFERRAL_KICKBACK,
    ].map((type) => ({
      label: formatUnderlineString(type),
      value: type,
    }));

    return {
      updatedBy: [...Array.from(updatedBy)],
      emailReferrer: Array.from(emailReferrer),
      emailReferee: Array.from(emailReferee),
      typeOfBenefits,
    };
  }

  async updateCronjobReferral(id: string, amount: number, reason: string, userId: string) {
    const cronJobFound = await prisma.cronJobLog.findFirst({
      where: { id },
      select: {
        dynamicValue: true,
        id: true,
        status: true,
        createdBy: true,
      },
    });

    if (!cronJobFound) {
      throw new BadRequestError(Messages.REFERRAL_CRONJOB_NOT_FOUND);
    }

    if (cronJobFound.status === CronJobStatus.SUCCESSFUL) {
      throw new BadRequestError(Messages.REFERRAL_CRONJOB_FAILED_TO_UPDATE);
    }

    const updatedBy = userId;
    // update referral bonus amount & update wallet of referrer
    const updatedDynamicJobValue = {
      ...(cronJobFound.dynamicValue as DynamicCronJobReferralTypes),
      bonusAmount: amount,
    };
    // find out referrer user id
    const referrerId = cronJobFound.createdBy || '';

    const commonSetting = await prisma.commonSetting.findFirst({
      where: { symbol: TypeCronJob.REFERRAL_CAMPAIGN },
    });

    const emailReferrer = (cronJobFound.dynamicValue as Prisma.JsonObject)?.referrerEmail || null;

    const result = await prisma.$transaction(
      async (tx) => {
        const cronJobUpdate = await tx.cronJobLog.update({
          where: { id },
          data: {
            dynamicValue: updatedDynamicJobValue,
            updatedBy: updatedBy,
            reason: reason,
            updatedAt: new Date(),
            status: CronJobStatus.SUCCESSFUL,
          },
        });

        if (!cronJobUpdate)
          throw new ConflictError(Messages.REFERRAL_CRONJOB_FAILED_TO_UPDATE + ' - cronjob');

        const wallet = await tx.wallet.findFirst({
          where: { userId: referrerId, type: WalletType.Referral },
        });

        if (!wallet)
          throw new BadRequestError(Messages.REFERRAL_CRONJOB_FAILED_TO_UPDATE + ' - wallet');

        const updateWallet = await tx.wallet.update({
          where: { id: wallet?.id },
          data: {
            frBalanceActive: { increment: amount },
            updatedAt: new Date(),
          },
        });

        if (!updateWallet)
          throw new ConflictError(Messages.REFERRAL_CRONJOB_FAILED_TO_UPDATE + ' - wallet');

        const newTransaction = await tx.transaction.create({
          data: {
            userId: referrerId,
            date: new Date(),
            type: TransactionType.Income,
            amount: amount,
            currency: 'FX',
            toCategoryId: null,
            createdBy: userId,
            updatedBy: userId,
            baseAmount: amount,
            baseCurrency: 'USD',
            remark: `Referral bonus for ${emailReferrer}`,
            toWalletId: wallet?.id,
            isMarked: true,
            commonId: commonSetting?.id || null,
          },
        });

        if (!newTransaction)
          throw new ConflictError(Messages.REFERRAL_CRONJOB_FAILED_TO_UPDATE + ' - transaction');

        const userUpdate = await tx.user.update({
          where: { id: referrerId },
          data: {
            is_referral_campaign_paid: true,
            updatedAt: new Date(),
          },
        });
        if (!userUpdate)
          throw new ConflictError(Messages.REFERRAL_CRONJOB_FAILED_TO_UPDATE + ' - user');
      },
      {
        timeout: 30000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return result;
  }
}

export const dashboardRepository = new DashboardRepository();
