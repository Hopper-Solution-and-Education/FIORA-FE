import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import type { Response } from '@/shared/types/Common.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  logoUrl: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => ({ url: ApiEndpointEnum.Profile, method: 'GET' }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<
      UserProfile,
      FormData | Partial<Pick<UserProfile, 'name' | 'phone' | 'address' | 'birthday'>>
    >({
      query: (body) =>
        body instanceof FormData
          ? { url: ApiEndpointEnum.Profile, method: 'PUT', body }
          : {
              url: ApiEndpointEnum.Profile,
              method: 'PUT',
              body,
              headers: { 'Content-Type': 'application/json' },
            },
      transformResponse: (response: Response<UserProfile>) => response.data,
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
