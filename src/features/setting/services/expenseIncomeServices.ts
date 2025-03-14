import {
  Category,
  RawCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { httpClient } from '@/config/HttpClient';
import { Response } from '@/shared/types/Common.types';

const expenseIncomeServices = {
  getCategories: async (): Promise<Response<RawCategory[]>> => {
    return httpClient.get<Response<RawCategory[]>>('/api/categories/expense-income');
  },
  createCategory: async (category: Omit<Category, 'id'>): Promise<Response<Category>> => {
    return httpClient.post<Response<Category>>('/api/categories/expense-income', category);
  },
  updateCategory: async (category: Category): Promise<Response<Category>> => {
    return httpClient.put<Response<Category>>(
      `/api/categories/expense-income/${category.id}`,
      category,
    );
  },
  deleteCategory: async (id: string): Promise<string> => {
    await httpClient.delete<void>(`/api/categories/expense-income?id=${id}`);
    return id;
  },
};

export default expenseIncomeServices;
