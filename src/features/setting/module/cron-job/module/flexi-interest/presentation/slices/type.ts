export interface FlexiInterestCronjobFilterState {
  status?: string[] | null;
  search?: string | null;
  membershipTier?: string[] | null;
  email?: string[] | null;
  updatedBy?: string[] | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface FlexiInterestStatistics {
  chartData: Array<{
    name: string;
    amount: number;
  }>
  totalAmount: number;
}

export interface FlexiInterestCronjobState {
  loading: boolean;
  error: string | null;
  filter: FlexiInterestCronjobFilterState;
  statistics?: FlexiInterestStatistics | null;
}
