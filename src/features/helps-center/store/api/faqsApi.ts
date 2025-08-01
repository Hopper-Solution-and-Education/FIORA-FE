import { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
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
  ReactionType,
  UpdateFaqRequest,
} from '../../domain/entities/models/faqs';

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/faqs',
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== 'validateImportFile') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: ['FaqImport', 'Faqs', 'FaqCategories', 'FaqDetails', 'FaqComments', 'FaqReactions'],

  endpoints: (builder) => ({
    getFaqs: builder.query<FaqListResponse, FaqsListQueryParams>({
      query: (params) => ({
        url: '/search',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: Response<FaqListResponse>) => response.data,
      providesTags: () => [{ type: 'Faqs', id: 'LIST' }],
    }),

    // FAQ Detail endpoints
    getFaqDetail: builder.query<
      FaqDetail,
      | string
      | {
          id: string;
          include?: string[];
          trackView?: boolean;
        }
    >({
      query: (params) => {
        // Handle both string ID and object with options
        if (typeof params === 'string') {
          return `/${params}?track_view=true`; // Default behavior: track view
        }

        const { id, include, trackView = true } = params;
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
        return `/${id}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: Response<FaqDetail>) => response.data,
      providesTags: (result, error, params) => {
        const id = typeof params === 'string' ? params : params.id;
        return [
          { type: 'FaqDetails', id },
          // { type: 'FaqComments', id },
          // { type: 'FaqReactions', id },
        ];
      },
    }),

    updateFaq: builder.mutation<void, { faqId: string; updateData: UpdateFaqRequest }>({
      query: ({ faqId, updateData }) => ({
        url: `/${faqId}`,
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
        url: `/${faqId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),

    createFaq: builder.mutation<
      { id: string },
      { title: string; description?: string; content: string; categoryId: string }
    >({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),

    // Paginated FAQ comments endpoint
    getFaqComments: builder.query<FaqComment[], string>({
      query: (faqId) => `/${faqId}/comments`,
      providesTags: (result, error, faqId) => [{ type: 'FaqComments', id: faqId }],
      transformResponse: (response: Response<FaqComment[]>) => response.data,
    }),

    createComment: builder.mutation<void, { faqId: string; comment: CreateCommentRequest }>({
      query: ({ faqId, comment }) => ({
        url: `/${faqId}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqComments', id: faqId }],
    }),

    deleteComment: builder.mutation<void, { faqId: string; commentId: string }>({
      query: ({ faqId, commentId }) => ({
        url: `/${faqId}/${commentId}`,
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
      query: (faqId) => `/${faqId}/reactions`,
      providesTags: (result, error, faqId) => [{ type: 'FaqReactions', id: faqId }],
      transformResponse: (response: Response<FaqReaction[]>) => response.data,
    }),
    createReaction: builder.mutation<
      void,
      { faqId: string; reaction: ReactionType; tempReactions: FaqReaction[] }
    >({
      query: ({ faqId, reaction }) => ({
        url: `/${faqId}/reactions`,
        method: 'POST',
        body: { reactionType: reaction },
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqReactions', id: faqId }],
      // Optimistic update
      async onQueryStarted({ faqId, tempReactions }, { dispatch, queryFulfilled }) {
        // Optimistically update the reactions list
        const patchResult = dispatch(
          faqsApi.util.updateQueryData('getFaqReactions', faqId, (draft) => {
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
        url: '/parse-validate',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: Response<FaqsImportValidationResult>) => response.data,
      transformErrorResponse: (response: any) => {
        if (response.data?.error) return response.data.error;
        if (response.data?.message) return response.data.message;
        return 'Failed to validate file';
      },
    }),
    importFaqs: builder.mutation<FaqsImportResult, { validRecords: FaqsRowValidated[] }>({
      query: (data) => ({
        url: '/import',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: Response<FaqsImportResult>) => response.data,
      transformErrorResponse: (response: any) => {
        if (response.data?.error) return response.data.error;
        if (response.data?.message) return response.data.message;
        return 'Failed to import FAQs';
      },
      invalidatesTags: ['FaqImport', { type: 'Faqs', id: 'LIST' }, 'FaqCategories'],
    }),

    // Category endpoints
    getFaqCategories: builder.query<FaqsCategoriesResponse[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      transformResponse: (response: Response<FaqsCategoriesResponse[]>) => response.data,
      providesTags: ['FaqCategories'],
    }),
    createFaqCategory: builder.mutation<void, { name: string; description: string }>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FaqCategories'],
    }),
    getFaqCategoriesWithPost: builder.query<
      FaqsCategoriesWithPostResponse[],
      FaqsCategoriesWithPostParams
    >({
      query: (params) => ({
        url: '/categories/with-post',
        method: 'GET',
        params,
      }),
      transformResponse: (response: Response<FaqsCategoriesWithPostResponse[]>) => response.data,
      providesTags: ['FaqCategories'],
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
} = faqsApi;
