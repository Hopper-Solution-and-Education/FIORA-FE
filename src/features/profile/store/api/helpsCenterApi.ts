import {
  ContactUsRequest,
  CreateCommentRequest,
  FaqComment,
  FaqDetail,
  FaqListResponse,
  FaqReaction,
  FaqsCategoriesResponse,
  FaqsCategoriesWithPostParams,
  FaqsCategoriesWithPostResponse,
  FaqsImportResult,
  FaqsImportValidationResult,
  FaqsListQueryParams,
  FaqsRowValidated,
  Post,
  ReactionType,
  UpdateFaqRequest,
} from '@/features/helps-center/domain/entities/models/faqs';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const helpsCenterApi = createApi({
  reducerPath: 'helpsCenterApi',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== 'validateImportFile') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: [
    'FaqImport',
    'Faqs',
    'FaqCategories',
    'FaqDetails',
    'FaqComments',
    'FaqReactions',
    'AboutUs',
    'UserTutorial',
    'ContactUs',
    'TermsAndConditions',
  ],

  endpoints: (builder) => ({
    getFaqs: builder.query<FaqListResponse, FaqsListQueryParams>({
      query: (params) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/search`,
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: Response<FaqListResponse>) => response.data,
      providesTags: () => [{ type: 'Faqs', id: 'LIST' }],
    }),

    // FAQ Detail endpoints
    getFaqDetail: builder.query<
      FaqDetail,
      {
        id: string;
        include?: string[];
        trackView?: boolean;
      }
    >({
      query: (params) => {
        const { id, include, trackView = false } = params;
        const queryParams = new URLSearchParams();

        // Add includes
        if (include && include.length > 0) {
          queryParams.set('include', include.join(','));
        }

        // Add view tracking
        if (trackView) {
          queryParams.set('track_view', 'true');
        }

        const queryString = queryParams.toString();
        return `${ApiEndpointEnum.HelpsCenterFaqs}/${id}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: Response<FaqDetail>) => response.data,
      providesTags: (result, error, params) => [{ type: 'FaqDetails', id: params.id }],
    }),

    updateFaq: builder.mutation<void, { faqId: string; updateData: UpdateFaqRequest }>({
      query: ({ faqId, updateData }) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { faqId }) => [
        { type: 'FaqDetails', id: faqId },
        { type: 'Faqs', id: 'LIST' },
      ],
    }),

    deleteFaq: builder.mutation<void, string>({
      query: (faqId) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),

    createFaq: builder.mutation<
      { id: string },
      { title: string; description?: string; content: string; categoryId: string }
    >({
      query: (data) => ({
        url: ApiEndpointEnum.HelpsCenterFaqs,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),

    // Paginated FAQ comments endpoint
    getFaqComments: builder.query<FaqComment[], string>({
      query: (faqId) => `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}/comments`,
      providesTags: (result, error, faqId) => [{ type: 'FaqComments', id: faqId }],
      transformResponse: (response: Response<FaqComment[]>) => response.data,
    }),

    createComment: builder.mutation<void, { faqId: string; comment: CreateCommentRequest }>({
      query: ({ faqId, comment }) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqComments', id: faqId }],
    }),

    deleteComment: builder.mutation<void, { faqId: string; commentId: string }>({
      query: ({ faqId, commentId }) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqComments', id: faqId }],
    }),

    // updateComment: builder.mutation<void, { faqId: string; commentId: string; content: string }>({
    //   query: ({ faqId, commentId, content }) => ({
    //     url: `/${faqId}/${commentId}`,
    //     method: 'PUT',
    //     body: { content },
    //   }),
    //   invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqDetails', id: faqId }],
    // }),

    // Reaction endpoints
    getFaqReactions: builder.query<FaqReaction[], string>({
      query: (faqId) => `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}/reactions`,
      providesTags: (result, error, faqId) => [{ type: 'FaqReactions', id: faqId }],
      transformResponse: (response: Response<FaqReaction[]>) => response.data,
    }),

    createReaction: builder.mutation<
      void,
      { faqId: string; reaction: ReactionType; tempReactions: FaqReaction[] }
    >({
      query: ({ faqId, reaction }) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/${faqId}/reactions`,
        method: 'POST',
        body: { reactionType: reaction },
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqReactions', id: faqId }],
      // Optimistic update
      async onQueryStarted({ faqId, tempReactions }, { dispatch, queryFulfilled }) {
        // Optimistically update the reactions list
        const patchResult = dispatch(
          helpsCenterApi.util.updateQueryData('getFaqReactions', faqId, (draft) => {
            if (!draft) return;
            draft.splice(0, draft.length, ...tempReactions);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    validateImportFile: builder.mutation<FaqsImportValidationResult, FormData>({
      query: (formData) => ({
        url: ApiEndpointEnum.HelpsCenterFaqsParseValidate,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: Response<FaqsImportValidationResult>) => response.data,
    }),

    importFaqs: builder.mutation<FaqsImportResult, { validRecords: FaqsRowValidated[] }>({
      query: (data) => ({
        url: ApiEndpointEnum.HelpsCenterFaqsImport,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: Response<FaqsImportResult>) => response.data,
      invalidatesTags: ['FaqImport', { type: 'Faqs', id: 'LIST' }],
    }),

    // Category endpoints
    getFaqCategories: builder.query<FaqsCategoriesResponse[], void>({
      query: () => ApiEndpointEnum.HelpsCenterFaqsCategories,
      transformResponse: (response: Response<FaqsCategoriesResponse[]>) => response.data,
      providesTags: ['FaqCategories'],
    }),

    createFaqCategory: builder.mutation<void, { name: string; description: string }>({
      query: (data) => ({
        url: ApiEndpointEnum.HelpsCenterFaqsCategories,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FaqCategories'],
    }),

    getFaqCategoriesWithPost: builder.query<
      FaqsCategoriesWithPostResponse[],
      FaqsCategoriesWithPostParams
    >({
      query: () => ApiEndpointEnum.HelpsCenterFaqsCategoriesWithPost,
      transformResponse: (response: Response<FaqsCategoriesWithPostResponse[]>) => response.data,
      providesTags: ['FaqCategories'],
    }),

    getAboutUs: builder.query<Post, void>({
      query: () => ApiEndpointEnum.HelpsCenterAboutUs,
      transformResponse: (response: Response<Post>) => response.data,
      providesTags: ['AboutUs'],
    }),
    getUserTutorial: builder.query<Post, void>({
      query: () => ApiEndpointEnum.HelpsCenterUserTutorial,
      transformResponse: (response: Response<Post>) => response.data,
      providesTags: ['UserTutorial'],
    }),

    contactUs: builder.mutation<void, ContactUsRequest>({
      query: (data) => ({
        url: ApiEndpointEnum.HelpsCenterContactUs,
        method: 'POST',
        body: data,
      }),
    }),

    updateTermsAndConditions: builder.mutation<void, { url: string }>({
      query: (data) => ({
        url: ApiEndpointEnum.HelpsCenterTermsAndConditions,
        method: 'POST',
        body: data,
      }),
    }),

    getTermsAndConditions: builder.query<Post, void>({
      query: () => ApiEndpointEnum.HelpsCenterTermsAndConditions,
      transformResponse: (response: Response<Post>) => response.data,
      providesTags: ['TermsAndConditions'],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetFaqCategoriesQuery,
  useGetFaqCategoriesWithPostQuery,
  useValidateImportFileMutation,
  useImportFaqsMutation,
  // FAQ Detail hooks
  useGetFaqDetailQuery,
  useUpdateFaqMutation,
  useCreateFaqMutation,
  useCreateFaqCategoryMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  // useUpdateCommentMutation,
  useCreateReactionMutation,
  useDeleteFaqMutation,
  useGetFaqCommentsQuery,
  useGetFaqReactionsQuery,

  useContactUsMutation,
  useGetAboutUsQuery,
  useGetUserTutorialQuery,
  useUpdateTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery,
} = helpsCenterApi;
