import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationDashboardTableColumnKey } from '../presentation/types/setting.type';
import { fetchFilterOptionsAsyncThunk } from './actions';
import { initialState } from './types';

/**
 * Redux slice for notification dashboard state management
 * Handles loading states, filters, column configuration, and error handling
 */
const notificationDashboardSlice = createSlice({
  name: 'notificationDashboard',
  initialState,
  reducers: {
    // Loading state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Filter management
    setNotificationDashboardFilter: (state, action: PayloadAction<typeof initialState.filter>) => {
      state.filter = action.payload;
    },
    // Action specifically for setting search only (used with debounce)
    setNotificationDashboardSearch: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },

    // Column visibility and ordering management
    toggleColumn: (state, action: PayloadAction<NotificationDashboardTableColumnKey>) => {
      const col = action.payload as keyof typeof state.columnConfig;
      state.columnConfig[col].isVisible = !state.columnConfig[col].isVisible;
    },
    resetColumns: (state) => {
      // Reset to default column configuration
      state.columnConfig = JSON.parse(JSON.stringify(initialState.columnConfig));
    },
    updateColumnIndex: (
      state,
      action: PayloadAction<{ key: NotificationDashboardTableColumnKey; newIndex: number }[]>,
    ) => {
      // Update column order after drag & drop
      action.payload.forEach(({ key, newIndex }) => {
        const col = key as keyof typeof state.columnConfig;
        state.columnConfig[col].index = newIndex;
      });
    },

    // Filter utilities
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
    setColumnConfig: (state, action: PayloadAction<typeof initialState.columnConfig>) => {
      // Load column configuration from localStorage
      state.columnConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle async filter options fetching
      .addCase(fetchFilterOptionsAsyncThunk.pending, (state) => {
        state.filterOptionsLoading = true;
        state.error = null;
      })
      .addCase(fetchFilterOptionsAsyncThunk.fulfilled, (state, action) => {
        state.filterOptionsLoading = false;
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptionsAsyncThunk.rejected, (state, action) => {
        state.filterOptionsLoading = false;
        state.error = action.payload || 'Failed to fetch filter options';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setNotificationDashboardFilter,
  setNotificationDashboardSearch,
  toggleColumn,
  resetColumns,
  updateColumnIndex,
  clearFilter,
  setColumnConfig,
} = notificationDashboardSlice.actions;
export default notificationDashboardSlice.reducer;
