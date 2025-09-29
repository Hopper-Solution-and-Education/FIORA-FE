import {
  SavingInterestChartResponse,
  SavingInterestResponse,
} from '../dto/response/SavingInterestResponse';

export interface SavingInterestFilters {
  status: string[];
  membershipTier: string[];
  email: string[];
  updatedBy: string[];
  search: string;
  fromDate: string;
  toDate: string;
}

export interface FilterOptions {
  emailOptions: { id: string; email: string }[];
  tierNameOptions: { id: string; tierName: string | null }[];
  updateByOptions: { id: string; email: string }[];
}

export interface ISavingInterestDashboardApi {
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
