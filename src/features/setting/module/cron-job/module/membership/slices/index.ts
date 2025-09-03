import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, MembershipCronjobState } from './types';

const membershipCronjobSlice = createSlice({
  name: 'membershipCronjob',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<MembershipCronjobState['filter']>) => {
      state.filter = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    setStatistics: (state, action: PayloadAction<MembershipCronjobState['statistics']>) => {
      state.statistics = action.payload;
    },
  },
});

export const { setLoading, setError, setFilter, setSearch, setStatistics } =
  membershipCronjobSlice.actions;

export default membershipCronjobSlice.reducer;
