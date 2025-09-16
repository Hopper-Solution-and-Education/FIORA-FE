import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { Response } from '@/shared/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FaqDetail as NewsDetail,
  FaqReaction as NewsReaction,
  ReactionType,
} from '../../../helps-center/domain/entities/models/faqs';
import {
  CommentCreationNews,
  CommentResponse,
  GetCommentRequest,
} from '../../api/types/commentDTO';
import { ListNewsResponse, NewsQueryParams, NewsUpdateRequest } from '../../api/types/newsDTO';
import { CreatePostCategoryRequest, PostCategoryResponse } from '../../api/types/postCategoryDTO';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['News', 'NewsCategories', 'NewsDetails', 'NewsComments', 'NewsReactions'],

  endpoints: (builder) => ({
    // New List endpoints
    getNews: builder.query<ListNewsResponse, NewsQueryParams>({
      query: (params) => ({
        url: `${ApiEndpointEnum.News}`,
        method: 'GET',
        params: params,
      }),
      transformResponse: (response: Response<ListNewsResponse>) => {
        return response.data;
      },
      providesTags: () => [{ type: 'News', id: 'LIST' }],
    }),

    // News Detail endpoints
    getNewsDetail: builder.query<
      NewsDetail,
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
        return `${ApiEndpointEnum.News}/${id}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: Response<NewsDetail>) => response.data,
      providesTags: (result, error, params) => [{ type: 'NewsDetails', id: params.id }],
    }),

    // News update endpoint
    // TODO: CHECK VALIDATION FOR OPTIONAL FIELDS
    updateNews: builder.mutation<void, { newsId: string; updateData: NewsUpdateRequest }>({
      query: ({ newsId, updateData }) => ({
        url: `${ApiEndpointEnum.News}/${newsId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { newsId }) => [
        { type: 'NewsDetails', id: newsId },
        { type: 'News', id: 'LIST' },
      ],
    }),

    deleteNews: builder.mutation<void, string>({
      query: (newsId) => ({
        url: `${ApiEndpointEnum.News}/${newsId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),

    // TODO: CHECK VALIDATION FOR OPTIONAL FIELDS
    createNews: builder.mutation<
      { id: string },
      {
        title: string;
        description?: string;
        content: string;
        categoryId: string;
        userId: string;
        type: string;
      }
    >({
      query: (data) => {
        console.log(data);
        return {
          url: ApiEndpointEnum.News,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
      transformResponse: (response: Response<{ id: string }>) => response.data,
    }),

    // Paginated News comments endpoint
    getNewsComments: builder.query<CommentResponse[], GetCommentRequest>({
      query: () => `${ApiEndpointEnum.News}/comment`,
      providesTags: (result, error, { newsId }) => [{ type: 'NewsComments', id: newsId }],
      transformResponse: (response: Response<CommentResponse[]>) => response.data,
    }),

    createComment: builder.mutation<void, CommentCreationNews>({
      query: (params) => ({
        url: `${ApiEndpointEnum.News}/comment`,
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result, error, { newsId }) => [{ type: 'NewsComments', id: newsId }],
    }),

    deleteComment: builder.mutation<void, { newsId: string; commentId: string }>({
      query: ({ newsId, commentId }) => ({
        url: `${ApiEndpointEnum.HelpsCenterFaqs}/${newsId}/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { newsId }) => [{ type: 'NewsComments', id: newsId }],
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
    getNewsReactions: builder.query<NewsReaction[], string>({
      query: (newsId) => `${ApiEndpointEnum.News}/${newsId}/reactions`,
      providesTags: (result, error, newsId) => [{ type: 'NewsReactions', id: newsId }],
      transformResponse: (response: Response<NewsReaction[]>) => response.data,
    }),

    createReaction: builder.mutation<
      void,
      { newsId: string; reaction: ReactionType; userId: string; tempReactions: NewsReaction[] }
    >({
      query: ({ newsId, reaction, userId }) => {
        return {
          url: `${ApiEndpointEnum.NewsReaction}`,
          method: 'POST',
          body: { newsId, reactType: reaction, userId },
        };
      },
      invalidatesTags: (result, error, { newsId }) => [{ type: 'NewsReactions', id: newsId }],
      // Optimistic update
      async onQueryStarted({ newsId, tempReactions }, { dispatch, queryFulfilled }) {
        // Optimistically update the reactions list
        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNewsReactions', newsId, (draft) => {
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

    // Category endpoints
    getNewsCategories: builder.query<PostCategoryResponse[], void>({
      query: () => ApiEndpointEnum.NewsCategories,
      transformResponse: (response: Response<PostCategoryResponse[]>) => response.data,
      providesTags: ['NewsCategories'],
    }),

    createNewsCategory: builder.mutation<void, CreatePostCategoryRequest>({
      query: (data) => ({
        url: ApiEndpointEnum.NewsCategories,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['NewsCategories'],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useLazyGetNewsQuery,
  useGetNewsCategoriesQuery,

  // News Detail hooks
  useGetNewsDetailQuery,
  useUpdateNewsMutation,
  useCreateNewsMutation,
  useCreateNewsCategoryMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  // useUpdateCommentMutation,
  useCreateReactionMutation,
  useDeleteNewsMutation,
  useGetNewsCommentsQuery,
  useGetNewsReactionsQuery,
} = newsApi;
