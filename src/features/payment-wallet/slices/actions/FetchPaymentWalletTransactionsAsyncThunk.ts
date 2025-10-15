import { httpClient } from '@/config/http-client/HttpClient';
import type { Response } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  FetchPaymentWalletTransactionsRequest,
  PaymentWalletPaginatedResponse,
} from '../types';

type RawPaymentWalletResponse = {
  data: any[];
  totalPage: number;
  page: number;
  pageSize: number;
  total: number;
  lastCursor?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

export const fetchPaymentWalletTransactionsAsyncThunk = createAsyncThunk<
  PaymentWalletPaginatedResponse,
  FetchPaymentWalletTransactionsRequest,
  { rejectValue: string }
>('paymentWallet/fetchTransactions', async (params, { rejectWithValue }) => {
  try {
    const body = {
      filters: params.filters || {},
      lastCursor: params.lastCursor,
      page: params.page,
      pageSize: params.pageSize || 10,
      search: params.searchParams || '',
    };

    const res = await httpClient.post<Response<RawPaymentWalletResponse>>(
      '/api/payment-wallet',
      body,
    );
    const r = res.data;

    const pagination = {
      page: r.page ?? 1,
      pageSize: r.pageSize ?? (params.pageSize || 10),
      total: r.total ?? (Array.isArray(r.data) ? r.data.length : 0),
      totalPage: r.totalPage ?? Math.max(1, Math.ceil((r.total ?? 0) / (r.pageSize ?? 10))),
      hasNextPage:
        r.hasNextPage ??
        (typeof r.page === 'number' && typeof r.totalPage === 'number'
          ? r.page < r.totalPage
          : Boolean(r.lastCursor)),
      hasPreviousPage: r.hasPreviousPage ?? (typeof r.page === 'number' ? r.page > 1 : undefined),
      lastCursor: r.lastCursor,
    };

    const normalized: PaymentWalletPaginatedResponse = {
      data: r.data ?? [],
      pagination,
    };

    return normalized;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to fetch payment wallet transactions';
    return rejectWithValue(msg);
  }
});
