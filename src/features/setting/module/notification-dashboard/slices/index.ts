import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationDashboardTableColumnKey } from '../presentation/types/setting.type';
import { initialState } from './types';

const notificationDashboardSlice = createSlice({
  name: 'notificationDashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setNotificationDashboardFilter: (state, action: PayloadAction<typeof initialState.filter>) => {
      state.filter = action.payload;
    },
    // Column menu actions
    toggleColumn: (state, action: PayloadAction<NotificationDashboardTableColumnKey>) => {
      const col = action.payload as keyof typeof state.columnConfig;
      state.columnConfig[col].isVisible = !state.columnConfig[col].isVisible;
    },
    resetColumns: (state) => {
      state.columnConfig = JSON.parse(JSON.stringify(initialState.columnConfig));
    },
    updateColumnIndex: (
      state,
      action: PayloadAction<{ key: NotificationDashboardTableColumnKey; newIndex: number }[]>,
    ) => {
      action.payload.forEach(({ key, newIndex }) => {
        const col = key as keyof typeof state.columnConfig;
        state.columnConfig[col].index = newIndex;
      });
    },
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setNotificationDashboardFilter,
  toggleColumn,
  resetColumns,
  updateColumnIndex,
  clearFilter,
} = notificationDashboardSlice.actions;
export default notificationDashboardSlice.reducer;
