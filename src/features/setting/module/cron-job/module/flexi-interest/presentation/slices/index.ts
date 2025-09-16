import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlexiInterestCronjobFilterState, FlexiInterestCronjobState, FlexiInterestStatistics } from './type';

export const initialState: FlexiInterestCronjobState = {
  loading: false,
  error: null,
  filter: {
    status: null,
    search: null,
    email: null,
    membershipTier: null,
    updatedBy: null,
    fromDate: null,
    toDate: null,
  },
  statistics: null,
};

const flexiInterestCronjobSlice = createSlice({
  name: 'flexiInterestTableCronjob',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<FlexiInterestCronjobFilterState>) => {
      state.filter = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
    setStatistics: (state, action: PayloadAction<FlexiInterestStatistics>) => {
      state.statistics = action.payload;
    },
    clearStatistics: (state) => {
      state.statistics = null;
    }
  },
});

export const { setLoading, setError, setFilter, setSearch, clearFilter, setStatistics, clearStatistics } =
  flexiInterestCronjobSlice.actions;

export default flexiInterestCronjobSlice.reducer;
