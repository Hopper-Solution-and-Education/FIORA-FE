import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionFilterCriteria, TransactionTableColumnKey } from '../types';
import {
  DEFAULT_TRANSACTION_FILTER_CRITERIA,
  DEFAULT_TRANSACTION_TABLE_COLUMNS,
} from '../utils/constants';

export type TransactionSliceType = {
  visibleColumns: TransactionTableColumnKey;
  filterCriteria: TransactionFilterCriteria;
  isFiltering: boolean;
};

const transactionInitialState: TransactionSliceType = {
  visibleColumns: DEFAULT_TRANSACTION_TABLE_COLUMNS,
  filterCriteria: DEFAULT_TRANSACTION_FILTER_CRITERIA,
  isFiltering: false,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: transactionInitialState,
  reducers: {
    updateUserId(state, action: PayloadAction<string>) {
      state.filterCriteria.userId = action.payload;
    },

    updateFilterCriteria(state, action: PayloadAction<TransactionFilterCriteria>) {
      state.filterCriteria = action.payload;
    },

    updateVisibleColumns(state, action: PayloadAction<TransactionTableColumnKey>) {
      state.visibleColumns = action.payload;
    },

    updateFilteringStatus(state, action: PayloadAction<boolean>) {
      state.isFiltering = action.payload;
    },

    resetFilterCriteria(state) {
      state.filterCriteria = transactionInitialState.filterCriteria;
    },
  },
});

export const {
  updateUserId,
  updateFilterCriteria,
  updateVisibleColumns,
  resetFilterCriteria,
  updateFilteringStatus,
} = transactionSlice.actions;

export default transactionSlice.reducer;
