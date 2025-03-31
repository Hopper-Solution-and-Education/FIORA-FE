import { httpClient } from '@/config/HttpClient';
import { Response } from '@/shared/types/Common.types';
import {
  NewCategoryDefaultValues,
  UpdateCategoryDefaultValues,
} from '@/features/home/module/category/slices/utils/formSchema';
import { Category, RawCategory } from '@/features/home/module/category/slices/types';

const categoryServices = {
  getCategories: async (): Promise<Response<RawCategory[]>> => {
    return httpClient.get<Response<RawCategory[]>>('/api/categories/expense-income');
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
