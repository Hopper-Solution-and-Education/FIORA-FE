import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import type { Response } from '@/shared/types/Common.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserProfile } from '../../domain/entities/models/profile';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: ['Profile', 'eKYC'],
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

    // eKYC api
    getEKYC: builder.query<any[], void>({
      query: () => ({ url: ApiEndpointEnum.eKYC, method: 'GET' }),
      transformResponse: (response: Response<any[]>) => response.data,
      providesTags: ['eKYC'],
    }),
    // eKYC contact verify
    sendOTP: builder.mutation<any, void>({
      query: () => ({ url: ApiEndpointEnum.sendOTP, method: 'POST' }),
    }),
    verifyOTP: builder.mutation<any, { otp: string }>({
      query: (body) => ({ url: ApiEndpointEnum.verifyOTP, method: 'POST', body }),
      transformResponse: (response: Response<any>) => response.data,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetEKYCQuery,
  useVerifyOTPMutation,
  useSendOTPMutation,
} = profileApi;
