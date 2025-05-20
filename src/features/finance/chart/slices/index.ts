import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { initialFinanceControlState } from './types';
import { getFinanceByDateAsyncThunk } from './actions/getFinanceByDateAsyncThunk';

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
        toast.success('Get finance by date successfully!');
      })
      .addCase(getFinanceByDateAsyncThunk.rejected, (state) => {
        state.isLoadingGetFinance = false;
      });
  },
});

export * from './types';
export const { resetFinanceControlState } = financeControlSlice.actions;
export default financeControlSlice.reducer;
