import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, ReferralTransactionFilterState } from '../types/transaction.type';

const referralTransactionSlice = createSlice({
  name: 'referralTransaction',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<ReferralTransactionFilterState>) => {
      state.filter = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
});

export const { setLoading, setError, setFilter, setSearch, clearFilter } =
  referralTransactionSlice.actions;
export default referralTransactionSlice.reducer;
