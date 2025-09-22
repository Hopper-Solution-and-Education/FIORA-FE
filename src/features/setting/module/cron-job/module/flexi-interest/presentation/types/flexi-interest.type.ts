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

// Thêm các interface mới cho chart và statistics
export interface FlexiInterestChartData {
  name: string;
  amount: number;
}

export interface FlexiInterestStatistics {
  chartData: FlexiInterestChartData[];
  totalAmount: number;
}

export interface TierInterestAmount {
  tierName: string;
  interestAmount: string;
}

export interface DashboardResponse {
  tierInterestAmount: TierInterestAmount[];
  totalInterestAmount: string;
}
