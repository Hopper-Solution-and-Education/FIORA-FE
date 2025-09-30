import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface UserApiResponse {
  avatarId: any;
  isBlocked: boolean;
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  role?: string;
  status?: string[];
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

        if (params.page) searchParams.append('page', params.page.toString());
        if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
        if (params.fromDate) searchParams.append('fromDate', params.fromDate);
        if (params.toDate) searchParams.append('toDate', params.toDate);
        if (params.role && params.role !== 'all') searchParams.append('role', params.role);
        if (params.status && params.status.length > 0) {
          params.status.forEach((status) => searchParams.append('status', status));
        }
        if (params.search) searchParams.append('search', params.search);

        return {
          url: `/users?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
