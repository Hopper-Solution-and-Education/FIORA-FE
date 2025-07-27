import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BudgetSummaryMapper } from '../data/mappers/BudgetSummaryMapper';
import { fetchBudgetYearsAsyncThunk } from './action/fetchBudgetYearsAsyncThunk';

export interface BudgetSummaryState {
  loading: boolean;
  error: string | null;
  budgetYears: string[] | null;
}

const initialState: BudgetSummaryState = {
  loading: false,
  error: null,
  budgetYears: null,
};

const budgetSummarySlice = createSlice({
  name: 'budgetSummary',
  initialState,
  reducers: {
    setBudgetYears: (state, action: PayloadAction<string[]>) => {
      state.budgetYears = action.payload;
    },
    addBudgetYear: (state, action: PayloadAction<string>) => {
      if (!state.budgetYears?.includes(action.payload)) {
        state.budgetYears?.push(action.payload);
      }
    },
    clearBudgetYears: (state) => {
      state.budgetYears = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetYearsAsyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetYearsAsyncThunk.fulfilled, (state, action) => {
        state.loading = false;
        const years = BudgetSummaryMapper.toBudgetYears(action.payload);
        state.budgetYears = years;
      })
      .addCase(fetchBudgetYearsAsyncThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budget years';
      });
  },
});

export const { setBudgetYears, addBudgetYear, clearBudgetYears } = budgetSummarySlice.actions;

export default budgetSummarySlice.reducer;
