import { ISmartSavingRepository } from '../domain/smartSavingRepository.interface';
import { smartSavingRepositoryInstance } from '../infrastructure/repositories/smartSavingRepository';

class SmartSavingtUsecases {
  constructor(private _smartSaving: ISmartSavingRepository = smartSavingRepositoryInstance) {}
  async getSmartSavingPaginated({
    page,
    pageSize,
    search,
    status,
    fromDate,
    toDate,
    emailUpdateBy,
    email,
    tierName,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string | string[];
    emailUpdateBy?: string | string[];
    email?: string | string[];
    tierName?: string | string[];
    fromDate?: string;
    toDate?: string;
  }) {
    const filter = {
      status,
      fromDate,
      toDate,
      emailUpdateBy,
      email,
      tierName,
    };
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
