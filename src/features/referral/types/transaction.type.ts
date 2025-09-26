import type { ReferralTransactionType } from '.';

export interface ReferralTransactionFilterState {
  type?: ReferralTransactionType[] | null;
  search?: string | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface ReferralTransactionState {
  loading: boolean;
  error: string | null;
  filter: ReferralTransactionFilterState;
  refreshKey: number;
}

export const initialState: ReferralTransactionState = {
  loading: false,
  error: null,
  filter: {
    type: null,
    search: null,
    fromDate: null,
    toDate: null,
  },
  refreshKey: 0,
};
