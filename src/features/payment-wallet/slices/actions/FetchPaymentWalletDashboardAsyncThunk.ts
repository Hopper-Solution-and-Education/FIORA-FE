import { httpClient } from '@/config/http-client/HttpClient';
import type { Response } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PaymentWalletDashboardMetrics } from '../types';

export const fetchPaymentWalletDashboardAsyncThunk = createAsyncThunk<
  PaymentWalletDashboardMetrics,
  void,
  {
    rejectValue: string;
  }
>('paymentWallet/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const response =
      await httpClient.get<Response<PaymentWalletDashboardMetrics>>('/api/payment-wallet');
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch payment wallet dashboard metrics';
    return rejectWithValue(errorMessage);
  }
});
