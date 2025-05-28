import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFinanceByCategoryAsyncThunk } from './actions/getFinanceByCategoryAsyncThunk';
import { getFinanceByDateAsyncThunk } from './actions/getFinanceByDateAsyncThunk';
import { initialFinanceControlState, ViewBy, ViewChartByCategory } from './types';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';

const financeControlSlice = createSlice({
  name: 'financeControl',
  initialState: initialFinanceControlState,
  reducers: {
    resetFinanceControlState: () => initialFinanceControlState,
    setViewBy: (state, action: PayloadAction<ViewBy>) => {
      state.viewBy = action.payload;
    },
    setViewChartByCategory: (state, action: PayloadAction<ViewChartByCategory>) => {
      state.viewChartByCategory = action.payload;
    },
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
        state.isLoadingGetFinance = true;
      })
      .addCase(getFinanceByCategoryAsyncThunk.fulfilled, (state, action) => {
        state.isLoadingGetFinance = false;
        switch (action.payload.data.reportType) {
          case FinanceReportEnum.CATEGORY:
            state.financeByCategory = action.payload.data.result;
            break;
          case FinanceReportEnum.ACCOUNT:
            state.financeByAccount = action.payload.data.result;
            break;
          case FinanceReportEnum.PRODUCT:
            state.financeByProduct = action.payload.data.result;
            break;
          case FinanceReportEnum.PARTNER:
            state.financeByPartner = action.payload.data.result;
            break;
        }
      })
      .addCase(getFinanceByCategoryAsyncThunk.rejected, (state) => {
        state.isLoadingGetFinance = false;
      });
  },
});

export * from './types';
export const { resetFinanceControlState, setViewBy, setViewChartByCategory } =
  financeControlSlice.actions;
export default financeControlSlice.reducer;
