import { httpClient } from '@/config/http-client/HttpClient';
import type { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  FetchPaymentWalletTransactionsRequest,
  PaymentWalletPaginatedResponse,
} from '../types';

export const fetchPaymentWalletTransactionsAsyncThunk = createAsyncThunk<
  PaymentWalletPaginatedResponse,
  FetchPaymentWalletTransactionsRequest,
  {
    rejectValue: string;
  }
>('paymentWallet/fetchTransactions', async (params, { rejectWithValue }) => {
  try {
    const requestBody = {
      filters: params.filters || {},
      lastCursor: params.lastCursor,
      page: params.page,
      pageSize: params.pageSize || 10,
      search: params.searchParams || '',
    };

    const response = await httpClient.post<Response<PaymentWalletPaginatedResponse>>(
      '/api/payment-wallet',
      requestBody,
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch payment wallet transactions';
    return rejectWithValue(errorMessage);
  }
});
