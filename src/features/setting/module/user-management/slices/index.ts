import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, UserManagementState } from './type';

export const initialState: UserManagementState = {
  loading: false,
  error: null,
  filters: {
    roles: [],
    status: [],
    fromDate: null,
    toDate: null,
  },
  searchQuery: '',
};

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUserFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFromDate: (state, action: PayloadAction<Date | null>) => {
      state.filters.fromDate = action.payload;
    },
    setToDate: (state, action: PayloadAction<Date | null>) => {
      state.filters.toDate = action.payload;
    },
    clearUserFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setUserFilters,
  setSearchQuery,
  setFromDate,
  setToDate,
  clearUserFilters,
  clearError,
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
