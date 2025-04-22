// src/store/slices/categorySlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { initialProductState } from './types';

const budgetControlSlice = createSlice({
  name: 'productManagement',
  initialState: initialProductState,
  reducers: {
    setIsLoadingBudget: (state, action) => {
      state.isLoadingGetBudget = action.payload;
    },
  },
});

export * from './types';
export const { setIsLoadingBudget } = budgetControlSlice.actions;
export default budgetControlSlice.reducer;
