export interface ReferralChartItem {
  typeOfBenefit: string;
  totalAmount: number;
  count: number;
}

export interface ReferralChartResponse {
  data: {
    summary: ReferralChartItem[];
    totalItems: number;
  };
  message: string;
  success: boolean;
}
