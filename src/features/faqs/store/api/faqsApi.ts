import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FaqsRowValidated,
  FaqsImportValidationResult,
  FaqsImportResult,
  FaqsListResponse,
  FaqsListCategoriesResponse,
  FaqsCategoriesResponse,
  FaqsListQueryParams,
} from '../../domain/entities/models/faqs';
import { Response } from '@/shared/types';

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
  tagTypes: ['FaqImport', 'Faqs', 'FaqCategories'],

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
      keepUnusedDataFor: 300,
    }),
    getFaqCategories: builder.query<FaqsCategoriesResponse[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      transformResponse: (response: Response<FaqsCategoriesResponse[]>) => response.data,
      providesTags: ['FaqCategories'],
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
  }),
});

export const {
  useGetFaqsQuery,
  useGetFaqCategoriesQuery,
  useValidateImportFileMutation,
  useImportFaqsMutation,
} = faqsApi;
