import { FilterCriteria } from '@/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavingHistoryResponse } from '../data/tdo/response/SavingHistoryResponse';
import { SavingOverviewResponse } from '../data/tdo/response/SavingOverviewResponse';
import { SavingTransactionResponse } from '../data/tdo/response/SavingTransactionResponse';
import { SavingTableColumnKey } from '../types';
import {
  DEFAULT_SAVING_FILTER_CRITERIA,
  DEFAULT_SAVING_TRANSACTION_TABLE_COLUMNS,
} from '../utils/constants';
import { createSavingTransaction, fetchSavingTransactions, getSavingWalletById } from './actions';

export type SavingWalletState = {
  overview: SavingOverviewResponse | null;
  history: SavingHistoryResponse | null;
  transaction: SavingTransactionResponse | null;
  loading: boolean;
  isCreateTransactionLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  visibleColumns: SavingTableColumnKey;
  filterCriteria: FilterCriteria;
  refetchTrigger: boolean;
  amountMin: number;
  amountMax: number;
};

const initialState: SavingWalletState = {
  overview: null,
  history: null,
  transaction: null,
  loading: false,
  isCreateTransactionLoading: false,
  error: null,
  page: 1,
  pageSize: 20,
  visibleColumns: DEFAULT_SAVING_TRANSACTION_TABLE_COLUMNS,
  filterCriteria: DEFAULT_SAVING_FILTER_CRITERIA,
  refetchTrigger: false,
  amountMin: 0,
  amountMax: 10000,
};

const savingWalletSlice = createSlice({
  name: 'savingWallet',
  initialState,
  reducers: {
    resetSavingWallet: () => initialState,
    updateFilterCriteria: (state, action: PayloadAction<FilterCriteria>) => {
      state.filterCriteria = action.payload;
      state.page = 1;
    },
    updatePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    updatePageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    updateVisibleColumns: (state, action: PayloadAction<SavingTableColumnKey>) => {
      state.visibleColumns = action.payload;
    },
    updateAmountRange(state, action: PayloadAction<{ min: number; max: number }>) {
      const { min, max } = action.payload;
      state.amountMin = min;
      state.amountMax = max;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(getSavingWalletById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavingWalletById.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(getSavingWalletById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching overview';
      })

      // History
      .addCase(fetchSavingTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavingTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchSavingTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching transactions';
      })

      // Transaction
      .addCase(createSavingTransaction.pending, (state) => {
        state.isCreateTransactionLoading = true;
        state.error = null;
      })
      .addCase(createSavingTransaction.fulfilled, (state, action) => {
        state.isCreateTransactionLoading = false;
        state.transaction = action.payload;
        state.refetchTrigger = !state.refetchTrigger;
      })
      .addCase(createSavingTransaction.rejected, (state, action) => {
        state.isCreateTransactionLoading = false;
        state.error = action.payload?.message || 'Error creating transaction';
      });
  },
});

export const {
  resetSavingWallet,
  updateFilterCriteria,
  updatePage,
  updatePageSize,
  updateVisibleColumns,
  updateAmountRange,
} = savingWalletSlice.actions;
export default savingWalletSlice.reducer;
