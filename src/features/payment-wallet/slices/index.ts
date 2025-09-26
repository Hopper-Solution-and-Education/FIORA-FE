import { FilterCriteria } from '@/shared/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPaymentWalletDashboardAsyncThunk,
  fetchPaymentWalletTransactionsAsyncThunk,
} from './actions';
import type { PaymentWalletState } from './types';

const initialState: PaymentWalletState = {
  dashboardMetrics: null,
  transactions: [],
  loading: false,
  dashboardLoading: false,
  transactionsLoading: false,
  error: null,
  dashboardError: null,
  transactionsError: null,
  filterCriteria: { userId: '', filters: {}, search: '' },
  searchTerm: null,
  pagination: null,
  pageSize: 10,
};

const paymentWalletSlice = createSlice({
  name: 'paymentWallet',
  initialState,
  reducers: {
    // Clear all errors
    clearError: (state) => {
      state.error = null;
      state.dashboardError = null;
      state.transactionsError = null;
    },

    // Clear dashboard error specifically
    clearDashboardError: (state) => {
      state.dashboardError = null;
    },

    // Clear transactions error specifically
    clearTransactionsError: (state) => {
      state.transactionsError = null;
    },

    // Set search term
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filterCriteria.search = action.payload || '';
    },

    // Set filter criteria
    setFilterCriteria: (state, action: { payload: FilterCriteria }) => {
      state.filterCriteria = action.payload;
    },

    // Set page size
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },

    // Clear transactions (useful for refreshing)
    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = null;
    },

    // Clear dashboard metrics
    clearDashboardMetrics: (state) => {
      state.dashboardMetrics = null;
    },

    // Reset all state
    resetPaymentWalletState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payment Wallet Dashboard Metrics
      .addCase(fetchPaymentWalletDashboardAsyncThunk.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
        state.loading = true;
      })
      .addCase(fetchPaymentWalletDashboardAsyncThunk.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardMetrics = action.payload;
        state.dashboardError = null;
        state.loading = false;
      })
      .addCase(fetchPaymentWalletDashboardAsyncThunk.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload || 'Failed to fetch dashboard metrics';
        state.error = action.payload || 'Failed to fetch dashboard metrics';
        state.loading = false;
      })

      // Fetch Payment Wallet Transactions
      .addCase(fetchPaymentWalletTransactionsAsyncThunk.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
        state.loading = true;
      })
      .addCase(fetchPaymentWalletTransactionsAsyncThunk.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload.data;
        state.pagination = action.payload.pagination;
        state.transactionsError = null;
        state.loading = false;
      })
      .addCase(fetchPaymentWalletTransactionsAsyncThunk.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.payload || 'Failed to fetch transactions';
        state.error = action.payload || 'Failed to fetch transactions';
        state.loading = false;
      });
  },
});

export const {
  clearError,
  clearDashboardError,
  clearTransactionsError,
  setSearchTerm,
  setFilterCriteria,
  setPageSize,
  clearTransactions,
  clearDashboardMetrics,
  resetPaymentWalletState,
} = paymentWalletSlice.actions;

export default paymentWalletSlice.reducer;
