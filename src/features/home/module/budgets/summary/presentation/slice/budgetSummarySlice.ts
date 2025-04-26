import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BudgetType } from '@prisma/client';
import { BudgetSummary, BudgetSummaryByType } from '../../domain/entities/BudgetSummary';
import getBudgetSummaryUseCase from '../../domain/usecases/getBudgetSummaryUseCase';

interface BudgetSummaryState {
  budgetSummary: BudgetSummary | null;
  budgetByType: BudgetSummaryByType | null;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetSummaryState = {
  budgetSummary: null,
  budgetByType: null,
  loading: false,
  error: null,
};

export const fetchBudgetSummary = createAsyncThunk(
  'budgetSummary/fetchBudgetSummary',
  async (fiscalYear: number, { rejectWithValue }) => {
    try {
      return await getBudgetSummaryUseCase.execute(fiscalYear);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch budget summary');
    }
  },
);

export const fetchBudgetByType = createAsyncThunk(
  'budgetSummary/fetchBudgetByType',
  async ({ fiscalYear, type }: { fiscalYear: number; type: BudgetType }, { rejectWithValue }) => {
    try {
      return await getBudgetSummaryUseCase.getByType(fiscalYear, type);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch budget by type');
    }
  },
);

const budgetSummarySlice = createSlice({
  name: 'budgetSummary',
  initialState,
  reducers: {
    clearBudgetSummary: (state) => {
      state.budgetSummary = null;
    },
    clearBudgetByType: (state) => {
      state.budgetByType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action: PayloadAction<BudgetSummary>) => {
        state.loading = false;
        state.budgetSummary = action.payload;
      })
      .addCase(fetchBudgetSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBudgetByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetByType.fulfilled, (state, action: PayloadAction<BudgetSummaryByType>) => {
        state.loading = false;
        state.budgetByType = action.payload;
      })
      .addCase(fetchBudgetByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBudgetSummary, clearBudgetByType } = budgetSummarySlice.actions;
export default budgetSummarySlice.reducer;
