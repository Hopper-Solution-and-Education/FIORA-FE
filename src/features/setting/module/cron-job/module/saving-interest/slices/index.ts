import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SavingInterestFilterState {
  status: string[];
  membershipTier: string[];
  email: string[];
  updatedBy: string[];
  search: string;
  fromDate: Date | null;
  toDate: Date | null;
}

const initialState: SavingInterestFilterState = {
  status: [],
  membershipTier: [],
  email: [],
  updatedBy: [],
  search: '',
  fromDate: new Date(), // Default to today
  toDate: new Date(), // Default to today
};

const savingInterestSlice = createSlice({
  name: 'savingInterest',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.status = action.payload;
    },
    setMembershipTierFilter: (state, action: PayloadAction<string[]>) => {
      state.membershipTier = action.payload;
    },
    setEmailFilter: (state, action: PayloadAction<string[]>) => {
      state.email = action.payload;
    },
    setUpdatedByFilter: (state, action: PayloadAction<string[]>) => {
      state.updatedBy = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setFromDateFilter: (state, action: PayloadAction<Date | null>) => {
      state.fromDate = action.payload;
    },
    setToDateFilter: (state, action: PayloadAction<Date | null>) => {
      state.toDate = action.payload;
    },
    resetFilters: () => ({
      ...initialState,
      fromDate: new Date(), // Reset to today
      toDate: new Date(), // Reset to today
    }),
  },
});

export const {
  setStatusFilter,
  setMembershipTierFilter,
  setEmailFilter,
  setUpdatedByFilter,
  setSearchFilter,
  setFromDateFilter,
  setToDateFilter,
  resetFilters,
} = savingInterestSlice.actions;

// Export action creators for use in components
export const setFilter = (filter: SavingInterestFilterState) => ({
  type: 'savingInterest/setFilter',
  payload: filter,
});

export default savingInterestSlice.reducer;
