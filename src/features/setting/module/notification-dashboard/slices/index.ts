import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
});

export const { setLoading, setError, clearError, setNotificationDashboardFilter, clearFilter } =
  notificationDashboardSlice.actions;
export default notificationDashboardSlice.reducer;
