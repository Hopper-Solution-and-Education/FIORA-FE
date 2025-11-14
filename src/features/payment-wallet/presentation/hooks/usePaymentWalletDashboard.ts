'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { clearDashboardError, clearDashboardMetrics } from '../../slices';
import { fetchPaymentWalletDashboardAsyncThunk } from '../../slices/actions';

export const usePaymentWalletDashboard = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Selectors
  const dashboardMetrics = useAppSelector((state) => state.paymentWallet.dashboardMetrics);
  const dashboardLoading = useAppSelector((state) => state.paymentWallet.dashboardLoading);
  const dashboardError = useAppSelector((state) => state.paymentWallet.dashboardError);

  // Fetch dashboard metrics
  // NOTE: return the dispatched promise so callers can await it
  const fetchDashboard = useCallback(() => {
    if (session?.user?.id) {
      // IMPORTANT: return the dispatch so caller can await the thunk
      // (fetchPaymentWalletDashboardAsyncThunk should be an async thunk that returns a Promise)
      return dispatch(fetchPaymentWalletDashboardAsyncThunk());
    }
    // return a resolved promise when no session (keeps signature consistent)
    return Promise.resolve();
  }, [dispatch, session?.user?.id]);

  // Refresh dashboard metrics
  const refreshDashboard = useCallback(() => {
    // clear existing metrics (optional) then refetch
    dispatch(clearDashboardMetrics());
    // return the promise so callers can await refreshDashboard()
    return fetchDashboard();
  }, [dispatch, fetchDashboard]);

  // Clear dashboard error
  const clearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  // Auto-fetch on session change
  useEffect(() => {
    if (!dashboardMetrics && session?.user?.id) {
      // call fetchDashboard() but we don't need to await here
      fetchDashboard();
    }
  }, [session?.user?.id, dashboardMetrics, fetchDashboard]);

  return {
    // Data
    dashboardMetrics,

    // Loading states
    dashboardLoading,

    // Error states
    dashboardError,

    // Actions
    fetchDashboard,
    refreshDashboard,
    clearError,
  };
};
