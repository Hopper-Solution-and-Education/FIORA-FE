import { createSlice } from '@reduxjs/toolkit';
import { getFinanceByCategoryAsyncThunk } from './actions/getFinanceByCategoryAsyncThunk';
import { getFinanceByDateAsyncThunk } from './actions/getFinanceByDateAsyncThunk';
import { initialFinanceControlState } from './types';

const financeControlSlice = createSlice({
  name: 'financeControl',
  initialState: initialFinanceControlState,
  reducers: {
    resetFinanceControlState: () => initialFinanceControlState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFinanceByDateAsyncThunk.pending, (state) => {
        state.isLoadingGetFinance = true;
      })
      .addCase(getFinanceByDateAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingGetFinance = false;
        state.financeByDate = action.payload;
      })
      .addCase(getFinanceByDateAsyncThunk.rejected, (state) => {
        state.isLoadingGetFinance = false;
      })
      .addCase(getFinanceByCategoryAsyncThunk.pending, (state) => {
        state.isLoadingGetFinanceByCategory = true;
      })
      .addCase(getFinanceByCategoryAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingGetFinanceByCategory = false;
        state.financeByCategory = action.payload.data.result;
      })
      .addCase(getFinanceByCategoryAsyncThunk.rejected, (state) => {
        state.isLoadingGetFinanceByCategory = false;
      });
  },
});

export * from './types';
export const { resetFinanceControlState } = financeControlSlice.actions;
export default financeControlSlice.reducer;
