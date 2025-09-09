import { prisma } from '@/config';
import { TypeCronJob } from '@prisma/client';

class DashboardRepository {
  async getWithFilters(
    filters: any,
    skip: number,
    take: number,
    tierFilters?: { fromTier?: string; toTier?: string },
  ) {
    if (tierFilters?.fromTier || tierFilters?.toTier) {
      if (tierFilters.fromTier) {
        filters.dynamicValue = {
          ...filters.dynamicValue,
          path: ['fromTier'],
          equals: tierFilters.fromTier,
        };
      }

      if (tierFilters.toTier) {
        filters.dynamicValue = {
          ...filters.dynamicValue,
          path: ['toTier'],
          equals: tierFilters.toTier,
        };
      }
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
}

export const dashboardRepository = new DashboardRepository();
