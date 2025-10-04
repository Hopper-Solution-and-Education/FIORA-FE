import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import type { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BankAccountFormData,
  IdentificationDocumentPayload,
  UserProfile,
  eKYC,
} from '../../domain/entities/models/profile';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: ['Profile', 'eKYC', 'BankAccount', 'IdentificationDocument'],
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
    getEKYC: builder.query<eKYC[], void>({
      query: () => ({ url: ApiEndpointEnum.eKYC, method: 'GET' }),
      transformResponse: (response: Response<eKYC[]>) => response.data,
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

    // Identification Document API
    getIdentificationDocument: builder.query<any, void>({
      query: () => ({ url: ApiEndpointEnum.IdentificationDocument, method: 'GET' }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['IdentificationDocument'],
    }),

    submitIdentificationDocument: builder.mutation<any, IdentificationDocumentPayload>({
      query: (body) => ({
        url: ApiEndpointEnum.IdentificationDocument,
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['IdentificationDocument', 'eKYC'],
    }),

    // Upload Attachment
    uploadAttachment: builder.mutation<
      any,
      { url: string; path: string; type: string; size?: number }
    >({
      query: (body) => ({
        url: '/api/attachment',
        method: 'POST',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
    }),

    // Bank Account API
    getBankAccount: builder.query<any, void>({
      query: () => ({ url: ApiEndpointEnum.BankAccount, method: 'GET' }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['BankAccount'],
    }),

    submitBankAccount: builder.mutation<any, BankAccountFormData>({
      query: (body) => ({
        url: ApiEndpointEnum.BankAccount,
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['BankAccount', 'eKYC'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetEKYCQuery,
  useVerifyOTPMutation,
  useSendOTPMutation,
  useGetIdentificationDocumentQuery,
  useSubmitIdentificationDocumentMutation,
  useUploadAttachmentMutation,
  useGetBankAccountQuery,
  useSubmitBankAccountMutation,
} = profileApi;
