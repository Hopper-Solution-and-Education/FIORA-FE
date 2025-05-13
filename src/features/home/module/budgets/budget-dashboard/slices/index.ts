import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { createBudgetAsyncThunk } from './actions';
import { getBudgetAsyncThunk } from './actions/getBudgetAsyncThunk';
import { initialBudgetControlState } from './types';

const budgetControlSlice = createSlice({
  name: 'budgetControl',
  initialState: initialBudgetControlState,
  reducers: {
    setIsLoadingBudget: (state, action) => {
      state.isLoadingGetBudget = action.payload;
    },
    setNextCursor: (state, action) => {
      state.getBudget = action.payload;
    },
    resetBudgetControlState: () => initialBudgetControlState,
    resetGetBudgetState: (state) => {
      state.getBudget = {
        budgets: [],
        isLoading: false,
        nextCursor: null,
        isLast: false,
        currency: 'VND',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBudgetAsyncThunk.pending, (state) => {
        state.isCreatingBudget = true;
      })
      .addCase(createBudgetAsyncThunk.fulfilled, (state) => {
        state.isCreatingBudget = false;
        toast.success('Create budget successfully!');
      })
      .addCase(createBudgetAsyncThunk.rejected, (state) => {
        state.isCreatingBudget = false;
      });

    builder
      .addCase(getBudgetAsyncThunk.pending, (state) => {
        state.getBudget.isLoading = true;
      })
      .addCase(getBudgetAsyncThunk.fulfilled, (state, action) => {
        state.getBudget.isLoading = false;
        // Deduplicate budgets by id
        const newBudgets = action.payload.data.filter(
          (newBudget) =>
            !state.getBudget.budgets.some(
              (existingBudget) => existingBudget.year === newBudget.year,
            ),
        );
        state.getBudget.budgets = [...state.getBudget.budgets, ...newBudgets];
        state.getBudget.nextCursor = action.payload.nextCursor;
        if (action.payload.nextCursor === null) {
          state.getBudget.isLast = true;
        }
        state.getBudget.currency = action.payload.currency;
      })
      .addCase(getBudgetAsyncThunk.rejected, (state) => {
        state.getBudget.isLast = true;
        state.getBudget.isLoading = false;
      });
  },
});

export * from './types';
export const { setIsLoadingBudget, setNextCursor, resetBudgetControlState, resetGetBudgetState } =
  budgetControlSlice.actions;
export default budgetControlSlice.reducer;
