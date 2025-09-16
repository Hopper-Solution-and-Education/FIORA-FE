import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, ReferralCronjobState } from './types';

const referralCronjobSlice = createSlice({
  name: 'referralCronjob',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<ReferralCronjobState['filter']>) => {
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
  referralCronjobSlice.actions;

export default referralCronjobSlice.reducer;
