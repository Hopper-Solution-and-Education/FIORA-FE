export interface MembershipCronjobFilterState {
  status?: string[] | null;
  search?: string | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface MembershipCronjobState {
  loading: boolean;
  error: string | null;
  filter: MembershipCronjobFilterState;
  statistics?: { statusCounts?: { successful?: number; fail?: number } };
}

export const initialState: MembershipCronjobState = {
  loading: false,
  error: null,
  filter: {
    status: null,
    search: null,
    fromDate: null,
    toDate: null,
  },
  statistics: undefined,
};
