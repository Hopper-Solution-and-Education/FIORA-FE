import { prisma } from '@/config';

class DashboardRepository {
  async get() {
    return await prisma.cronJobLog.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const dashboardRepository = new DashboardRepository();
