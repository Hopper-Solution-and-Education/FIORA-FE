import { prisma } from '@/config';
import { CronJobStatus, TypeCronJob } from '@prisma/client';
import { IFlexiInterestRepository } from '../../domain/repositories/flexiInterestRepositories.Interface';

class flexiInterestRepositories implements IFlexiInterestRepository {
  constructor(private _prisma = prisma) {}
  async getFlexiInterestPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    // search?: string,
  ): Promise<{ items: any[]; total: number; totalSuccess: number; totalFailed: number }> {
    const skip = (page - 1) * pageSize;
    // query danh sách log
    const where: any = {
      typeCronJob: TypeCronJob.FLEXI_INTEREST,
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
        flexiInterestRate: dv?.rate ?? null,
        activeBalance: dv?.prevBalance ?? null,
        flexiInterestAmount: dv?.interestAmount ?? null,
        updateBy: 'System',
        status: log.status,
        reason: dv?.reason ?? null,
      };
    });

    return { items, total, totalSuccess, totalFailed };
  }

  async getFlexiInterestStatistics() {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ typeCronJob: 'FLEXI_INTEREST' }),
      });

      const result = await response.json();

      if (result.status === 200) {
        return result.data;
      }

      throw new Error(result.message || 'Failed to fetch flexi interest statistics');
    } catch (error) {
      console.error('Error fetching flexi interest statistics:', error);
      throw error;
    }
  }
}

export const FlexiInterestRepositories = new flexiInterestRepositories();
