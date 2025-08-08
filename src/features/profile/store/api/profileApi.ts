import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import type { Response } from '@/shared/types/Common.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => ({ url: ApiEndpointEnum.Profile, method: 'GET' }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({ url: ApiEndpointEnum.Profile, method: 'PUT', body }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
