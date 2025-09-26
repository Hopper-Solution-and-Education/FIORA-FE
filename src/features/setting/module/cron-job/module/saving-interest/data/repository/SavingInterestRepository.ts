import { decorate, inject, injectable } from 'inversify';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';
import { FilterOptions, SavingInterestFilters } from '../api/ISavingInterestDashboardApi';
import { SavingInterestDashboardApi } from '../api/SavingInterestDashboardApi';
import {
  SavingInterestChartResponse,
  SavingInterestResponse,
} from '../dto/response/SavingInterestResponse';

export interface ISavingInterestRepository {
  getSavingInterestData(
    page: number,
    pageSize: number,
    filters: SavingInterestFilters,
  ): Promise<SavingInterestResponse>;
  getSavingInterestChartData(
    filters: Partial<SavingInterestFilters>,
  ): Promise<SavingInterestChartResponse>;
  getFilterOptions(): Promise<FilterOptions>;
}

export class SavingInterestRepository implements ISavingInterestRepository {
  private api: SavingInterestDashboardApi;

  constructor(api: SavingInterestDashboardApi) {
    this.api = api;
  }

  async getSavingInterestData(
    page: number,
    pageSize: number,
    filters: SavingInterestFilters,
  ): Promise<SavingInterestResponse> {
    return this.api.getSavingInterestData(page, pageSize, filters);
  }

  async getSavingInterestChartData(
    filters: Partial<SavingInterestFilters>,
  ): Promise<SavingInterestChartResponse> {
    return this.api.getSavingInterestChartData(filters);
  }

  async getFilterOptions(): Promise<FilterOptions> {
    return this.api.getFilterOptions();
  }
}

decorate(injectable(), SavingInterestRepository);
decorate(inject(SAVING_INTEREST_TYPES.ISavingInterestDashboardApi), SavingInterestRepository, 0);

// Re-export the interface for use in other modules
export type { SavingInterestFilters };
