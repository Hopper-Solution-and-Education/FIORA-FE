import { prisma } from '@/config';

class DashboardRepository {
  async getWithFilters(filters: any, skip: number, take: number) {
    return await prisma.cronJobLog.findMany({
      where: filters,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        Transaction: {
          select: {
            id: true,
            amount: true,
            currency: true,
            date: true,
            type: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
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
            },
          },
        },
      },
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
}

export const dashboardRepository = new DashboardRepository();
