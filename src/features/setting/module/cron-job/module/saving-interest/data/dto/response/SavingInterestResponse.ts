import { SavingInterestTableData } from '@/features/setting/module/cron-job/module/saving-interest/presentation/types/saving-interest.type';

// Raw API response format for table data
export interface SmartSavingTableApiResponse {
  status: number;
  message: string;
  data: {
    items: SavingInterestTableData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    totalSuccess: number;
    totalFailed: number;
  };
}

// Internal format after data extraction
export interface SavingInterestResponse {
  items: SavingInterestTableData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  totalSuccess: number;
  totalFailed: number;
}

export interface SavingInterestChartItem {
  tierName: string; // Changed from membershipTier to match real API
  interestAmount: string; // Changed from totalAmount to match real API
  percent: string; // Changed from count to match real API
}

// Raw API response format
export interface SmartSavingStatisticsApiResponse {
  status: number;
  message: string;
  data: {
    tierInterestAmount: SavingInterestChartItem[];
    totalInterestAmount: string;
  };
}

// Internal format after data extraction
export interface SavingInterestChartResponse {
  tierInterestAmount: SavingInterestChartItem[];
  totalInterestAmount: string;
}
