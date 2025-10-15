import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  kyc_levels: string[];
  createdAt: string;
  updatedAt: string;
  avatarId?: string | null;
  avatarUrl?: string | null;
  eKYC?: {
    id: string;
    status: string;
    method: string;
    type: string;
    fieldName: string;
    createdAt: string;
  }[];
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  userFromDate?: string;
  userToDate?: string;
  roles?: string[];
  status?: string[];
  emails?: string[];
  search?: string;
}

export interface GetUsersResponse {
  data: UserApiResponse[];
  total: number;
  hasMore: boolean;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/profile',
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Pagination
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

        // KYC Submission Date Range
        if (params.fromDate) searchParams.append('fromDate', params.fromDate);
        if (params.toDate) searchParams.append('toDate', params.toDate);

        // User Registration Date Range - NEW
        if (params.userFromDate) searchParams.append('userFromDate', params.userFromDate);
        if (params.userToDate) searchParams.append('userToDate', params.userToDate);

        // Roles filter
        if (params.roles && params.roles.length > 0) {
          params.roles.forEach((role) => searchParams.append('role', role));
        }

        // Status filter
        if (params.status && params.status.length > 0) {
          params.status.forEach((status) => searchParams.append('status', status));
        }

        // Email filter - FIXED: use emails instead of userIds
        if (params.emails && params.emails.length > 0) {
          params.emails.forEach((email) => searchParams.append('email', email));
        }

        // Search
        if (params.search) searchParams.append('search', params.search);

        return {
          url: `/users?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Users'],
    }),
    getCountUsers: builder.query<number, { eKycStatus?: string } | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.eKycStatus) qs.append('eKycStatus', params.eKycStatus);
        return { url: `/count-users${qs.toString() ? `?${qs.toString()}` : ''}`, method: 'GET' };
      },
      transformResponse: (resp: any) => {
        return resp?.data ?? 0;
      },
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetCountUsersQuery,
  useLazyGetUsersQuery,
  useLazyGetCountUsersQuery,
} = usersApi;
