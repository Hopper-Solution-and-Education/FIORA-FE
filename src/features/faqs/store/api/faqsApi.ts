import { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateCommentRequest,
  FaqDetailData,
  FaqsCategoriesResponse,
  FaqsImportResult,
  FaqsImportValidationResult,
  FaqsListCategoriesResponse,
  FaqsListQueryParams,
  FaqsListResponse,
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
    getFaqs: builder.query<FaqsListResponse | FaqsListCategoriesResponse, FaqsListQueryParams>({
      query: (params) => ({
        url: '/search',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: Response<FaqsListResponse | FaqsListCategoriesResponse>) =>
        response.data,
      providesTags: (result) =>
        result && 'faqs' in result
          ? [
              ...result.faqs.map(({ id }) => ({ type: 'Faqs' as const, id })),
              { type: 'Faqs', id: 'LIST' },
            ]
          : [{ type: 'Faqs', id: 'LIST' }],
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          type: queryArgs.type,
          limit: queryArgs.limit,
          filters: {
            search: queryArgs.filters?.search || '',
            categories: queryArgs.filters?.categories
              ? [...queryArgs.filters.categories].sort()
              : [],
          },
        };
      },
    }),

    // FAQ Detail endpoints
    getFaqDetail: builder.query<
      FaqDetailData,
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
      transformResponse: (response: Response<FaqDetailData>) => response.data,
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

    // Comment endpoints
    createComment: builder.mutation<void, { faqId: string; comment: CreateCommentRequest }>({
      query: ({ faqId, comment }) => ({
        url: `/${faqId}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqDetails', id: faqId }],
    }),

    deleteComment: builder.mutation<void, { faqId: string; commentId: string }>({
      query: ({ faqId, commentId }) => ({
        url: `/${faqId}/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqDetails', id: faqId }],
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
    createReaction: builder.mutation<void, { faqId: string; reaction: ReactionType }>({
      query: ({ faqId, reaction }) => ({
        url: `/${faqId}/reaction`,
        method: 'POST',
        body: { reactionType: reaction },
      }),
      invalidatesTags: (result, error, { faqId }) => [{ type: 'FaqDetails', id: faqId }],
    }),

    deleteReaction: builder.mutation<void, string>({
      query: (faqId) => ({
        url: `/${faqId}/reaction`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, faqId) => [{ type: 'FaqDetails', id: faqId }],
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
  }),
});

export const {
  useGetFaqsQuery,
  useGetFaqCategoriesQuery,
  useValidateImportFileMutation,
  useImportFaqsMutation,
  // FAQ Detail hooks
  useGetFaqDetailQuery,
  useUpdateFaqMutation,
  useCreateFaqCategoryMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  // useUpdateCommentMutation,
  useCreateReactionMutation,
  useDeleteReactionMutation,
  useDeleteFaqMutation,
} = faqsApi;
