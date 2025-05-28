import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllAccountAsyncThunk,
  getAllPartnerAsyncThunk,
  getAllProductAsyncThunk,
  getFinanceByCategoryAsyncThunk,
  getFinanceByDateAsyncThunk,
} from './actions';
import { initialFinanceControlState, ViewBy, ViewChartByCategory } from './types';

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
    setSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccounts = action.payload;
    },
    setSelectedProducts: (state, action: PayloadAction<string[]>) => {
      state.selectedProducts = action.payload;
    },
    setSelectedPartners: (state, action: PayloadAction<string[]>) => {
      state.selectedPartners = action.payload;
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
    builder
      .addCase(getAllAccountAsyncThunk.pending, (state) => {
        state.accounts.isLoadingGetAccounts = true;
      })
      .addCase(getAllAccountAsyncThunk.fulfilled, (state, action) => {
        state.accounts.isLoadingGetAccounts = false;
        state.accounts.data = action.payload.accounts;
      })
      .addCase(getAllAccountAsyncThunk.rejected, (state) => {
        state.accounts.isLoadingGetAccounts = false;
      });
    builder
      .addCase(getAllProductAsyncThunk.pending, (state) => {
        state.products.isLoadingGetProducts = true;
      })
      .addCase(getAllProductAsyncThunk.fulfilled, (state, action) => {
        state.products.isLoadingGetProducts = false;
        state.products.data = action.payload.data;
      })
      .addCase(getAllProductAsyncThunk.rejected, (state) => {
        state.products.isLoadingGetProducts = false;
      });
    builder
      .addCase(getAllPartnerAsyncThunk.pending, (state) => {
        state.partners.isLoadingGetPartners = true;
      })
      .addCase(getAllPartnerAsyncThunk.fulfilled, (state, action) => {
        state.partners.isLoadingGetPartners = false;
        state.partners.data = action.payload.data;
      })
      .addCase(getAllPartnerAsyncThunk.rejected, (state) => {
        state.partners.isLoadingGetPartners = false;
      });
  },
});

export * from './types';
export const {
  resetFinanceControlState,
  setViewBy,
  setViewChartByCategory,
  setSelectedAccounts,
  setSelectedProducts,
  setSelectedPartners,
} = financeControlSlice.actions;
export default financeControlSlice.reducer;
