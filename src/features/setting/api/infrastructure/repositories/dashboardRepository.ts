import { prisma } from '@/config';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { CreateBoxNotificationInput } from '@/features/notification/domain/repositories/notificationRepository.interface';
import { applyJsonInFilter, normalizeToArray } from '@/shared/utils/filterUtils';
import { CronJobLog, CronJobStatus, MembershipTier, TypeCronJob } from '@prisma/client';

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

  async getCount(filters: any) {
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
    userId: string,
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
          updatedBy: userId,
          updatedAt: new Date(),
          tierId: tier.id,
          tiersendid: tier.id,
        },
      });

      const status = updatedProgress ? CronJobStatus.SUCCESSFUL : CronJobStatus.FAIL;

      const updatedCronJobLog = await tx.cronJobLog.update({
        where: { id: cronjobData.id },
        data: {
          updatedBy: userId,
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
        orClauses.push({ dynamicValue: { path: ['fromTier'], in: tierIds } });
        orClauses.push({ dynamicValue: { path: ['toTier'], in: tierIds } });
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
}

export const dashboardRepository = new DashboardRepository();
