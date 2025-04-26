import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { createBudgetAsyncThunk } from './actions';
import { initialBudgetControlState } from './types';
import { getBudgetAsyncThunk } from './actions/getBudgetAsyncThunk';

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
        state.getBudget.budgets = action.payload.data;
        state.getBudget.nextCursor = action.payload.nextCursor;
      })
      .addCase(getBudgetAsyncThunk.rejected, (state) => {
        state.getBudget.isLoading = false;
      });
  },
});

export * from './types';
export const { setIsLoadingBudget, setNextCursor } = budgetControlSlice.actions;
export default budgetControlSlice.reducer;
