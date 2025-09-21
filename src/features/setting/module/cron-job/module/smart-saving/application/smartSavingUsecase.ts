import { ISmartSavingRepository } from '../domain/smartSavingRepository.interface';
import { smartSavingRepositoryInstance } from '../infrastructure/smartSavingRepository';

class SmartSavingtUsecases {
  constructor(private _smartSaving: ISmartSavingRepository = smartSavingRepositoryInstance) {}
  async getSmartSavingPaginated({
    page = 1,
    pageSize = 20,
    filter = {},
    search = '',
  }: {
    page?: number;
    pageSize?: number;
    filter?: Record<string, any>;
    search?: string;
  }) {
    const { items, total, totalSuccess, totalFailed } =
      await this._smartSaving.getSmartSavingPaginated(page, pageSize, filter, search);
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalSuccess,
      totalFailed,
    };
  }
  async getSmartSavingStatistics() {
    return await this._smartSaving.getSmartSavingStatistics();
  }
  async updateSmartSavingAmount(
    CronJobLdata: {
      amount: number;
      reason: string;
    },
    cronJobId: string,
    adminId: string,
  ) {
    return await this._smartSaving.updateSmartSavingAmount(CronJobLdata, cronJobId, adminId);
  }
}
export const smartSavingUsecaseInstance = new SmartSavingtUsecases();
