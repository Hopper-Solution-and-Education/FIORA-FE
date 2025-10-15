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
  const fetchDashboard = useCallback(() => {
    if (session?.user?.id) {
      dispatch(fetchPaymentWalletDashboardAsyncThunk());
    }
  }, [dispatch, session?.user?.id]);

  // Refresh dashboard metrics
  const refreshDashboard = useCallback(() => {
    dispatch(clearDashboardMetrics());
    fetchDashboard();
  }, [dispatch, fetchDashboard]);

  // Clear dashboard error
  const clearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  // Auto-fetch on session change
  useEffect(() => {
    if (!dashboardMetrics && session?.user?.id) {
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
