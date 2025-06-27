import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FaqsRowValidated,
  FaqsImportValidationResult,
  FaqsImportResult,
  FaqsListResponse,
} from '../../domain/entities/models/faqs';
import { FaqsListCategoriesResponse } from '../../domain/repositories/IFaqsRepository';
import { Response } from '@/shared/types';
import { FilterCriteria } from '@/shared/types';

export interface FaqsListQueryParams {
  type?: 'most-viewed' | 'by-categories' | 'by-category';
  categoryId?: string;
  limit?: number;
  search?: string;
  // Legacy support
  page?: number;
  pageSize?: number;
  filters?: FilterCriteria;
}

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
    getFaqs: builder.mutation<FaqsListResponse | FaqsListCategoriesResponse, FaqsListQueryParams>({
      query: (params) => ({
        url: '/search',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: Response<FaqsListResponse | FaqsListCategoriesResponse>) =>
        response.data,
      invalidatesTags: (result) =>
        result && 'faqs' in result
          ? [
              ...result.faqs.map(({ id }) => ({ type: 'Faqs' as const, id })),
              { type: 'Faqs', id: 'LIST' },
            ]
          : [{ type: 'Faqs', id: 'LIST' }],
    }),
    getFaqCategories: builder.query<string[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      transformResponse: (response: Response<string[]>) => response.data,
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
  useGetFaqsMutation,
  useGetFaqCategoriesQuery,
  useValidateImportFileMutation,
  useImportFaqsMutation,
} = faqsApi;
