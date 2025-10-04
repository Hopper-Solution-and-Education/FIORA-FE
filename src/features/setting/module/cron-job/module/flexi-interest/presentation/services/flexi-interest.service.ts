import type { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const flexiInterestApi = createApi({
  reducerPath: 'flexiInterestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: ['FlexiInterest', 'MembershipTier', 'FlexiInterestChart', 'FlexiInterestOptions'],
  endpoints: (builder) => ({
    getFlexiInterest: builder.query<any, any>({
      query: (body) => ({ url: 'api/flexi-interest', method: 'POST', body }),
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
    getOptions: builder.query<any, void>({
      query: () => ({ url: 'api/flexi-interest', method: 'GET' }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['FlexiInterestOptions'],
    }),
  }),
});

export const {
  useGetFlexiInterestQuery,
  useLazyGetFlexiInterestQuery,
  useGetMembershipTierQuery,
  useLazyGetMembershipTierQuery,
  useGetFlexiInterestStatisticsQuery,
  useGetOptionsQuery,
  useLazyGetOptionsQuery,
} = flexiInterestApi;
