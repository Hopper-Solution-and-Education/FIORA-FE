import type { Response } from '@/shared/types/Common.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const flexiInterestApi = createApi({
  reducerPath: 'flexiInterestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: ['FlexiInterest', 'MembershipTier', 'FlexiInterestChart'],
  endpoints: (builder) => ({
    getFlexiInterest: builder.query<any, { page: number; pageSize: number; filter: string }>({
      query: (params) => ({ url: 'api/flexi-Interest', method: 'GET', params }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['FlexiInterest'],
    }),
    getMembershipTier: builder.query<any, void>({
      query: () => ({ url: 'api/memberships', method: 'GET' }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['MembershipTier'],
    }),
    getFlexiInterestStatistics: builder.query<any, void>({
      query: () => ({
        url: 'api/dashboard/flexi-interest-chart',
        method: 'GET',
        params: { typeCronJob: 'FLEXI_INTEREST' },
      }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['FlexiInterestChart'],
    }),
  }),
});

export const {
  useGetFlexiInterestQuery,
  useLazyGetFlexiInterestQuery,
  useGetMembershipTierQuery,
  useLazyGetMembershipTierQuery,
  useGetFlexiInterestStatisticsQuery,
} = flexiInterestApi;
