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
      // Reset to today's date when clearing filters
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999,
      );

      state.filter = {
        ...initialState.filter,
        fromDate: startOfDay,
        toDate: endOfDay,
      };
    },
    setTypeOfBenefitFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.typeOfBenefit = action.payload;
    },
  },
});

export const { setLoading, setError, setFilter, setSearch, clearFilter, setTypeOfBenefitFilter } =
  referralCronjobSlice.actions;

export default referralCronjobSlice.reducer;
