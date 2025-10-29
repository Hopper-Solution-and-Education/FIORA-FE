import { ComposedChartDataItem } from '@/components/common/charts/composed-chart/type';

export type FlexiInterestCronjobTableStatusType = 'SUCCESSFUL' | 'FAIL';

export type FlexiInterestCronjobTableData = {
  id: string;
  email?: string;
  dateTime: string;
  membershipTier?: string;
  flexiInterestRate?: number | string;
  activeBalance?: number;
  flexiInterestAmount?: number;
  status: FlexiInterestCronjobTableStatusType;
  updateBy?: string;
  reason?: string;
};

export interface FlexiInterestStatistics {
  chartData: FlexiInterestChartDataItem[];
  totalAmount: number;
}

export interface TierInterestAmount {
  tierId: string;
  tierName: string;
  interestAmount: string;
}

export interface DashboardResponse {
  tierInterestAmount: TierInterestAmount[];
  totalInterestAmount: string;
}

export interface FlexiInterestChartDataItem extends ComposedChartDataItem {
  id: string;
  name: string;
  amount: number;
}
