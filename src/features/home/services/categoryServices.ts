import { httpClient } from '@/config/http-client/HttpClient';
import { Category, CategoryFilterResponse } from '@/features/home/module/category/slices/types';
import {
  NewCategoryDefaultValues,
  UpdateCategoryDefaultValues,
} from '@/features/home/module/category/slices/utils/formSchema';
import { FilterCriteria, GlobalFilters, Response } from '@/shared/types';

const categoryServices = {
  getCategories: async (data: FilterCriteria): Promise<Response<CategoryFilterResponse>> => {
    return httpClient.post<Response<CategoryFilterResponse>>('/api/categories/search', data);
  },
  searchCategories: async (data: GlobalFilters): Promise<Response<CategoryFilterResponse>> => {
    return httpClient.post<Response<CategoryFilterResponse>>('/api/categories/search', data);
  },
  createCategory: async (category: NewCategoryDefaultValues): Promise<Response<Category>> => {
    return httpClient.post<Response<Category>>('/api/categories/expense-income', category);
  },
  updateCategory: async (category: UpdateCategoryDefaultValues): Promise<Response<Category>> => {
    return httpClient.put<Response<Category>>(`/api/categories/expense-income`, category);
  },
  deleteCategory: async (id: string, newCategoryId: string | undefined): Promise<string> => {
    if (newCategoryId) {
      await httpClient.delete<void>(`/api/categories/expense-income?id=${id}`, {
        newid: newCategoryId,
      });
    } else {
      await httpClient.delete<void>(`/api/categories/expense-income?id=${id}`);
    }
    return id;
  },
};

export default categoryServices;
