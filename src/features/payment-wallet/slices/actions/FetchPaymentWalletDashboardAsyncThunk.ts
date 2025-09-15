import { httpClient } from '@/config/http-client/HttpClient';
import type { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FetchPaymentWalletDashboardRequest, PaymentWalletDashboardMetrics } from '../types';

export const fetchPaymentWalletDashboardAsyncThunk = createAsyncThunk<
  PaymentWalletDashboardMetrics,
  FetchPaymentWalletDashboardRequest | void,
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
