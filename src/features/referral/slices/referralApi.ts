import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetReferralUsersParams,
  PaginatedTransactionResponse,
  ReferralEarnings,
  ReferralStats,
  ReferralTransaction,
  ReferralUser,
  ReferralUsersResponse,
} from '../types';
import type { ReferralTransactionFilterState } from '../types/transaction.type';
import { mapEarnings, mapReferralItem, mapTransactions, toQueryString } from '../utils';

// Re-export types for convenience
export type { GetReferralUsersParams, ReferralStats, ReferralUser, ReferralUsersResponse };

// UI-facing types

export const referralApi = createApi({
  reducerPath: 'referralApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: ['ReferralStats', 'ReferralUsers', 'ReferralEarnings', 'ReferralTransactions'],
  endpoints: (builder) => ({
    // Stats (counts)
    getReferralStats: builder.query<ReferralStats, void>({
      query: () => ({ url: '/api/referral/stats', method: 'GET' }),
      transformResponse: (resp: any) => resp?.data as ReferralStats,
      providesTags: ['ReferralStats'],
    }),

    // Invites (paginated)
    getReferralUsers: builder.query<ReferralUsersResponse, GetReferralUsersParams | void>({
      query: (params) => {
        const p = params || {};
        const qs = toQueryString({
          status: p.status,
          search: p.search,
          page: p.page,
          pageSize: p.limit,
        });
        return { url: `/api/referral/invites${qs}`, method: 'GET' };
      },
      transformResponse: (resp: any) => {
        const result = resp?.data as {
          items: any[];
          total: number;
          page: number;
          pageSize: number;
        };
        const items = Array.isArray(result?.items) ? result.items : [];
        const mapped = items.map(mapReferralItem);
        const total = result?.total ?? 0;
        const page = result?.page ?? 1;
        const pageSize = result?.pageSize ?? 10;
        const totalPages = Math.ceil(total / pageSize);
        const hasMore = page < totalPages;
        return {
          data: mapped,
          total,
          hasMore,
          currentPage: page,
          totalPages,
        } as ReferralUsersResponse;
      },
      providesTags: ['ReferralUsers'],
    }),

    // Invites (infinite list)
    getReferralUsersInfinite: builder.query<ReferralUser[], GetReferralUsersParams | void>({
      query: (params) => {
        const p = params || {};
        const qs = toQueryString({
          status: p.status,
          search: p.search,
          page: p.page || 1,
          pageSize: p.limit || 5,
        });
        return { url: `/api/referral/invites${qs}`, method: 'GET' };
      },
      transformResponse: (resp: any) => {
        const result = resp?.data as { items: any[] };
        const items = Array.isArray(result?.items) ? result.items : [];
        return items.map(mapReferralItem);
      },
      providesTags: ['ReferralUsers'],
    }),

    // Earnings summary (dashboard)
    getReferralEarnings: builder.query<ReferralEarnings, void>({
      query: () => ({ url: '/api/referral/dashboard', method: 'GET' }),
      transformResponse: (resp: any) => mapEarnings(resp?.data || {}),
      providesTags: ['ReferralEarnings'],
    }),

    // Wallet transactions (recent)
    getReferralTransactions: builder.query<
      ReferralTransaction[],
      ReferralTransactionFilterState | void
    >({
      query: (filters) => {
        const params: Record<string, any> = {};

        if (filters?.type && filters.type.length > 0) {
          params.type = filters.type;
        }
        if (filters?.search) {
          params.search = filters.search;
        }
        if (filters?.fromDate) {
          params.fromDate = filters.fromDate.toISOString();
        }
        if (filters?.toDate) {
          params.toDate = filters.toDate.toISOString();
        }

        const qs = toQueryString(params);
        return { url: `/api/referral/transactions${qs}`, method: 'GET' };
      },
      transformResponse: (resp: any) => mapTransactions((resp?.data || []) as any[]),
      providesTags: ['ReferralTransactions'],
    }),

    // Wallet transactions (paginated for infinity scroll)
    getReferralTransactionsPaginated: builder.query<
      { transactions: ReferralTransaction[]; total: number; hasMore: boolean },
      { page: number; pageSize: number; filters?: ReferralTransactionFilterState }
    >({
      query: ({ page, pageSize, filters }) => {
        const params: Record<string, any> = {
          page: page.toString(),
          pageSize: pageSize.toString(),
        };

        if (filters?.type && filters.type.length > 0) {
          params.type = filters.type;
        }
        if (filters?.search) {
          params.search = filters.search;
        }
        if (filters?.fromDate) {
          params.fromDate = filters.fromDate.toISOString();
        }
        if (filters?.toDate) {
          params.toDate = filters.toDate.toISOString();
        }

        const qs = toQueryString(params);
        return { url: `/api/referral/transactions${qs}`, method: 'GET' };
      },
      transformResponse: (resp: any) => {
        const data = resp?.data as PaginatedTransactionResponse;
        const transactions = mapTransactions((data?.items || []) as any[]);
        return {
          transactions,
          total: data?.total || 0,
          hasMore: data?.hasMore || false,
        };
      },
      providesTags: ['ReferralTransactions'],
    }),

    // Actions
    inviteByEmails: builder.mutation<
      { created: string[]; duplicates: string[] },
      { emails: string[] }
    >({
      query: ({ emails }) => ({ url: '/api/referral/invites', method: 'POST', body: { emails } }),
      transformResponse: (resp: any) => resp?.data as { created: any[]; duplicates: string[] },
      invalidatesTags: ['ReferralUsers', 'ReferralStats'],
    }),

    withdraw: builder.mutation<
      { fromWallet: any; toWallet: any },
      { amount: number; minThreshold?: number }
    >({
      query: ({ amount, minThreshold }) => ({
        url: '/api/referral/withdraw',
        method: 'POST',
        body: { amount, minThreshold },
      }),
      invalidatesTags: ['ReferralEarnings', 'ReferralTransactions'],
    }),
  }),
});

export const {
  useGetReferralStatsQuery,
  useGetReferralUsersQuery,
  useGetReferralUsersInfiniteQuery,
  useLazyGetReferralUsersQuery,
  useLazyGetReferralUsersInfiniteQuery,
  useGetReferralEarningsQuery,
  useGetReferralTransactionsQuery,
  useGetReferralTransactionsPaginatedQuery,
  useLazyGetReferralTransactionsPaginatedQuery,
  useInviteByEmailsMutation,
  useWithdrawMutation,
} = referralApi;
