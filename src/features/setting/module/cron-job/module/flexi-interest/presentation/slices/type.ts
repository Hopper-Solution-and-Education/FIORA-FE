export interface FlexiInterestCronjobFilterState {
  status?: string[] | null;
  search?: string | null;
  tierName?: string[] | null;
  email?: string[] | null;
  emailUpdateBy?: string[] | null;
  fromDate: Date | string | null;
  toDate: Date | string | null;
}

export interface FlexiInterestStatistics {
  chartData: Array<{
    name: string;
    amount: number;
  }>;
  totalAmount: number;
}

export interface FlexiInterestCronjobState {
  loading: boolean;
  error: string | null;
  filter: FlexiInterestCronjobFilterState;
  statistics?: FlexiInterestStatistics | null;
}
