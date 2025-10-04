import { httpClient } from '@/config/http-client/HttpClient';
import { Category } from '@/features/home/module/category/slices/types';
import { Response } from '@/shared/types';

const expenseIncomeServices = {
  getCategories: async (): Promise<Response<Category[]>> => {
    return httpClient.get<Response<Category[]>>('/categories/expense-income');
  },
  createCategory: async (category: Omit<Category, 'id'>): Promise<Response<Category>> => {
    return httpClient.post<Response<Category>>('/categories/expense-income', category);
  },
  updateCategory: async (category: Category): Promise<Response<Category>> => {
    return httpClient.put<Response<Category>>(
      `/categories/expense-income/${category.id}`,
      category,
    );
  },
  deleteCategory: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/categories/expense-income/${id}`);
  },
};

export default expenseIncomeServices;
