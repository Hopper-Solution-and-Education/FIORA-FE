export interface FlexiInterestCronjobFilterState {
  status?: string[] | null;
  search?: string | null;
  membershipTier?: string[] | null;
  email?: string[] | null;
  updatedBy?: string[] | null;
  fromDate: Date | string | null;
  toDate: Date | string | null;
}

export interface FlexiInterestCronjobState {
  loading: boolean;
  error: string | null;
  filter: FlexiInterestCronjobFilterState;
}
