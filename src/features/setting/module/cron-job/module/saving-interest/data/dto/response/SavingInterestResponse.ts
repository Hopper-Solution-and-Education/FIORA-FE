import { SavingInterestTableData } from '../../presentation/types/saving-interest.type';

export interface SavingInterestResponse {
  items: SavingInterestTableData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SavingInterestChartItem {
  membershipTier: string;
  totalAmount: number;
  count: number;
}

export interface SavingInterestChartResponse {
  summary: SavingInterestChartItem[];
  totalItems: number;
}
