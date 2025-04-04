import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionFilterCriteria, TransactionTableColumnKey } from '../types';
import {
  DEFAULT_TRANSACTION_FILTER_CRITERIA,
  DEFAULT_TRANSACTION_TABLE_COLUMNS,
} from '../utils/constants';

export type TransactionSliceType = {
  visibleColumns: TransactionTableColumnKey;
  filterCriteria: TransactionFilterCriteria;
  amountMin: number;
  amountMax: number;
};

const transactionInitialState: TransactionSliceType = {
  visibleColumns: DEFAULT_TRANSACTION_TABLE_COLUMNS,
  filterCriteria: DEFAULT_TRANSACTION_FILTER_CRITERIA,
  amountMin: 0,
  amountMax: 10000,
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

    updateAmountRange(state, action: PayloadAction<{ min: number; max: number }>) {
      const { min, max } = action.payload;
      state.amountMin = min;
      state.amountMax = max;
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
  updateAmountRange,
} = transactionSlice.actions;

export default transactionSlice.reducer;
