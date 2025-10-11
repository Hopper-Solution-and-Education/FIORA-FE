import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import type { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BankAccountFormData,
  IdentificationDocumentPayload,
  UpdateProfileRequest,
  UserProfile,
  eKYC,
} from '../../domain/entities/models/profile';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => headers,
  }),
  tagTypes: [
    'Profile',
    'eKYC',
    'BankAccount',
    'IdentificationDocument',
    'eKYCByUserId',
    'ProfileByUserId',
    'IdentificationDocumentByUserId',
    'BankAccountByUserId',
    'UserManagement',
  ],
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

    // Admin/CS: Get eKYC by userId
    getEKYCByUserId: builder.query<eKYC[], string>({
      query: (userId) => ({ url: `/api/eKyc/user/${userId}`, method: 'GET' }),
      transformResponse: (response: Response<eKYC[]>) => response.data,
      providesTags: ['eKYCByUserId'],
    }),

    // Admin/CS: Get Identification Document by userId
    getIdentificationDocumentByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/indentification-document/user/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['IdentificationDocumentByUserId'],
    }),

    // Admin/CS: Get Bank Account by userId
    getBankAccountByUserId: builder.query<any, string>({
      query: (userId) => ({ url: `/api/bank-account/user/${userId}`, method: 'GET' }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['BankAccountByUserId'],
    }),

    // Admin/CS: Get Profile by userId
    getProfileByUserId: builder.query<UserProfile, string>({
      query: (userId) => ({ url: `/api/profile/user/${userId}`, method: 'GET' }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      providesTags: ['ProfileByUserId'],
    }),

    // Admin/CS: Update Profile by userId
    updateProfileByUserId: builder.mutation<
      UserProfile,
      { userId: string; payload: UpdateProfileRequest }
    >({
      query: ({ userId, payload }) =>
        payload instanceof FormData
          ? {
              url: `/api/profile/user/${userId}`,
              method: 'PUT',
              body: payload,
            }
          : {
              url: `/api/profile/user/${userId}`,
              method: 'PUT',
              body: payload,
              headers: { 'Content-Type': 'application/json' },
            },
      transformResponse: (response: Response<UserProfile>) => response.data,
      invalidatesTags: ['ProfileByUserId'],
    }),

    // Admin/CS: Verify eKYC (approve/reject)
    verifyEKYC: builder.mutation<any, { kycId: string; status: string; remarks?: string }>({
      query: ({ kycId, ...body }) => ({
        url: `/api/eKyc/verify/${kycId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: [
        'eKYCByUserId',
        'eKYC',
        'IdentificationDocumentByUserId',
        'BankAccountByUserId',
        'ProfileByUserId',
      ],
    }),

    // Delete eKYC for re-submit
    deleteEKYC: builder.mutation<any, string>({
      query: (kycId) => ({ url: `/api/eKyc/${kycId}`, method: 'DELETE' }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: [
        'eKYC',
        'IdentificationDocument',
        'BankAccount',
        'eKYCByUserId',
        'IdentificationDocumentByUserId',
        'BankAccountByUserId',
      ],
    }),
    // Block User
    blockUser: builder.mutation<any, { blockUserId: string; reason?: string }>({
      query: (body) => ({
        url: '/api/profile/block',
        method: 'PUT',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['UserManagement', 'ProfileByUserId'],
    }),

    // Assign Role
    assignRole: builder.mutation<any, { assignUserId: string; role: string }>({
      query: (body) => ({
        url: '/api/profile/assign-role',
        method: 'PUT',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['UserManagement', 'ProfileByUserId'],
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
  useGetEKYCByUserIdQuery,
  useVerifyEKYCMutation,
  useGetIdentificationDocumentByUserIdQuery,
  useGetBankAccountByUserIdQuery,
  useGetProfileByUserIdQuery,
  useUpdateProfileByUserIdMutation,
  useDeleteEKYCMutation,
  useBlockUserMutation,
  useAssignRoleMutation,
} = profileApi;
