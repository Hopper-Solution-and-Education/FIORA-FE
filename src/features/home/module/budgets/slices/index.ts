// src/store/slices/categorySlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { initialBudgetControlState } from './types';
import { createBudgetAsyncThunk } from './actions';
import { toast } from 'sonner';

const budgetControlSlice = createSlice({
  name: 'budgetControl',
  initialState: initialBudgetControlState,
  reducers: {
    setIsLoadingBudget: (state, action) => {
      state.isLoadingGetBudget = action.payload;
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
  },
});

export * from './types';
export const { setIsLoadingBudget } = budgetControlSlice.actions;
export default budgetControlSlice.reducer;
