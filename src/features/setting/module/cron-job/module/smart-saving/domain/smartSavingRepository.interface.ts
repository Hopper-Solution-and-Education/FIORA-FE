import { CronJobLog } from '@prisma/client';

export interface ISmartSavingRepository {
  getSmartSavingPaginated(
    page: number,
    pageSize: number,
    filter?: any,
    search?: string,
  ): Promise<{ items: any[]; total: number; totalSuccess: number; totalFailed: number }>;

  getSmartSavingStatistics(): Promise<{
    tierInterestAmount: Array<{
      tierName: string;
      interestAmount: string;
      percent: string;
    }>;
    totalInterestAmount: string;
  }>;
  updateSmartSavingAmount(
    CronJobLdata: {
      amount: number;
      reason: string;
    },
    cronJobId: string,
    userId: string,
  ): Promise<{
    item: CronJobLog | null;
  }>;
}
