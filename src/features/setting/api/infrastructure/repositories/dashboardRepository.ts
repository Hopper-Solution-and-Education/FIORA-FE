import { prisma } from '@/config';

class DashboardRepository {
  async getWithFilters(filters: any, skip: number, take: number) {
    const logs = await prisma.cronJobLog.findMany({
      where: filters,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const creatorIds = logs
      .map((log) => log.createdBy)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);
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

    return logs.map((log) => ({
      ...log,
      tierFrom: creatorMap.get(log.createdBy ?? '')?.MembershipProgress[0]?.tier?.tierName || null,
      tierTo: creatorMap.get(log.createdBy ?? '')?.MembershipProgress[0]?.tier?.tierName || null,
      balance: creatorMap.get(log.createdBy ?? '')?.MembershipProgress[0]?.currentBalance || 0,
      spent: creatorMap.get(log.createdBy ?? '')?.MembershipProgress[0]?.currentSpent || 0,
      updatedBy: creatorMap.get(log.updatedBy ?? '') || null,
    }));
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
}

export const dashboardRepository = new DashboardRepository();
