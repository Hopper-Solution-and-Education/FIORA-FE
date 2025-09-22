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

export interface ISavingInterestDashboardApi {
  getSavingInterestData(
    page: number,
    pageSize: number,
    filters: SavingInterestFilters,
  ): Promise<SavingInterestResponse>;
  getSavingInterestChartData(
    filters: Partial<SavingInterestFilters>,
  ): Promise<SavingInterestChartResponse>;
}
