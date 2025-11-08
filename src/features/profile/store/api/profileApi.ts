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
    'MyProfile',
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
      query: (body) => ({ url: ApiEndpointEnum.Profile, method: 'PUT', body }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      invalidatesTags: ['Profile'],
    }),

    // Profile Settings Actions
    sendProfileOTP: builder.mutation<any, { type: 'email' | 'phone' | 'delete' }>({
      query: (body) => ({
        url: ApiEndpointEnum.ProfileSendOTP,
        method: 'POST',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
    }),

    changeEmail: builder.mutation<any, { newEmail: string; otp: string }>({
      query: (body) => ({
        url: ApiEndpointEnum.ProfileChangeEmail,
        method: 'POST',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['Profile'],
    }),

    changePassword: builder.mutation<any, { currentPassword: string; newPassword: string }>({
      query: (body) => ({
        url: ApiEndpointEnum.ProfileChangePassword,
        method: 'POST',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
    }),

    deleteAccount: builder.mutation<any, { otp: string }>({
      query: (body) => ({
        url: ApiEndpointEnum.ProfileDelete,
        method: 'DELETE',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['Profile'],
    }),

    verifyReferralCode: builder.mutation<{ referrerName: string }, { referralCode: string }>({
      query: (body) => ({
        url: ApiEndpointEnum.ProfileVerifyReferralCode,
        method: 'POST',
        body,
      }),
      transformResponse: (response: Response<{ referrerName: string }>) => response.data,
    }),

    // eKYC api
    getEKYC: builder.query<eKYC[], void>({
      query: () => ({ url: ApiEndpointEnum.eKYC, method: 'GET' }),
      transformResponse: (response: Response<eKYC[]>) => response.data,
      providesTags: ['eKYC'],
    }),
    // eKYC contact verify
    sendOTP: builder.mutation<any, void>({
      query: () => ({ url: ApiEndpointEnum.eKYCSendOTP, method: 'POST' }),
    }),
    verifyOTP: builder.mutation<any, { otp: string }>({
      query: (body) => ({ url: ApiEndpointEnum.eKYCContactVerifyOTP, method: 'POST', body }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['eKYC', 'Profile'],
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
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['IdentificationDocument', 'eKYC'],
    }),

    updateIdentificationDocument: builder.mutation<
      any,
      IdentificationDocumentPayload & { id: string }
    >({
      query: (body) => ({
        url: ApiEndpointEnum.IdentificationDocument,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['IdentificationDocument', 'eKYC'],
    }),

    // Upload Attachment
    uploadAttachment: builder.mutation<
      any,
      { url: string; path: string; type: string; size?: number }
    >({
      query: (body) => ({ url: '/api/attachment', method: 'POST', body }),
      transformResponse: (response: Response<any>) => response.data,
    }),

    // Bank Account API
    getBankAccount: builder.query<any, void>({
      query: () => ({ url: ApiEndpointEnum.BankAccount, method: 'GET' }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['BankAccount'],
    }),

    submitBankAccount: builder.mutation<any, BankAccountFormData>({
      query: (body) => ({ url: ApiEndpointEnum.BankAccount, method: 'POST', body }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['BankAccount', 'eKYC'],
    }),

    updateBankAccount: builder.mutation<any, BankAccountFormData & { id: string }>({
      query: (body) => ({
        url: ApiEndpointEnum.BankAccount,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: ['BankAccount', 'eKYC'],
    }),

    // Admin/CS: Get eKYC by userId
    getEKYCByUserId: builder.query<eKYC[], string>({
      query: (userId) => ({ url: `${ApiEndpointEnum.eKYCByUserId}/${userId}`, method: 'GET' }),
      transformResponse: (response: Response<eKYC[]>) => response.data,
      providesTags: ['eKYCByUserId'],
    }),

    // Admin/CS: Get Identification Document by userId
    getIdentificationDocumentByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `${ApiEndpointEnum.IdentificationDocumentByUserId}/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['IdentificationDocumentByUserId'],
    }),

    // Admin/CS: Get Bank Account by userId
    getBankAccountByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `${ApiEndpointEnum.BankAccountByUserId}/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['BankAccountByUserId'],
    }),

    // Admin/CS: Get Profile by userId
    getProfileByUserId: builder.query<UserProfile, string>({
      query: (userId) => ({
        url: `${ApiEndpointEnum.ProfileByUserId}/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      providesTags: ['ProfileByUserId'],
    }),

    // Admin/CS: Update Profile by userId
    updateProfileByUserId: builder.mutation<
      UserProfile,
      { userId: string; payload: UpdateProfileRequest }
    >({
      query: ({ userId, payload }) => ({
        url: `${ApiEndpointEnum.ProfileByUserId}/${userId}`,
        method: 'PUT',
        body: payload,
      }),
      transformResponse: (response: Response<UserProfile>) => response.data,
      invalidatesTags: ['ProfileByUserId'],
    }),

    // Admin/CS: Verify eKYC (approve/reject)
    verifyEKYC: builder.mutation<any, { kycId: string; status: string; remarks?: string }>({
      query: ({ kycId, ...body }) => ({
        url: `${ApiEndpointEnum.eKYCVerify}/${kycId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: [
        'eKYC',
        'eKYCByUserId',
        'ProfileByUserId',
        'IdentificationDocumentByUserId',
        'BankAccountByUserId',
      ],
    }),

    // Admin/CS: Send OTP for eKYC verification
    sendOtpVerifyEKYC: builder.mutation<any, void>({
      query: () => ({ url: '/api/eKyc/verify/send-otp', method: 'POST' }),
      transformResponse: (response: Response<any>) => response.data,
    }),

    // Admin/CS: Verify OTP for eKYC verification
    verifyOtpVerifyEKYC: builder.mutation<any, { otp: string }>({
      query: (body) => ({ url: '/api/eKyc/verify/verify-otp', method: 'POST', body }),
      transformResponse: (response: Response<any>) => response.data,
    }),

    // Delete eKYC for re-submit
    deleteEKYC: builder.mutation<any, string>({
      query: (kycId) => ({ url: `${ApiEndpointEnum.eKYC}/${kycId}`, method: 'DELETE' }),
      transformResponse: (response: Response<any>) => response.data,
      invalidatesTags: [
        'eKYC',
        'IdentificationDocument',
        'BankAccount',
        'ProfileByUserId',
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
      transformResponse: (response: Response<any>) => response,
      invalidatesTags: ['UserManagement', 'ProfileByUserId', 'MyProfile'],
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
      invalidatesTags: ['UserManagement', 'ProfileByUserId', 'MyProfile'],
    }),

    // myprofile
    getMyProfile: builder.query<any, string>({
      query: (userId) => ({
        url: `/api/profile/myprofile?userId=${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: Response<any>) => response.data,
      providesTags: ['MyProfile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSendProfileOTPMutation,
  useChangeEmailMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useVerifyReferralCodeMutation,
  useGetEKYCQuery,
  useVerifyOTPMutation,
  useSendOTPMutation,
  useGetIdentificationDocumentQuery,
  useSubmitIdentificationDocumentMutation,
  useUpdateIdentificationDocumentMutation,
  useUploadAttachmentMutation,
  useGetBankAccountQuery,
  useSubmitBankAccountMutation,
  useUpdateBankAccountMutation,
  useGetEKYCByUserIdQuery,
  useVerifyEKYCMutation,
  useSendOtpVerifyEKYCMutation,
  useVerifyOtpVerifyEKYCMutation,
  useGetIdentificationDocumentByUserIdQuery,
  useGetBankAccountByUserIdQuery,
  useGetProfileByUserIdQuery,
  useUpdateProfileByUserIdMutation,
  useDeleteEKYCMutation,
  useBlockUserMutation,
  useAssignRoleMutation,
  useGetMyProfileQuery,
} = profileApi;
