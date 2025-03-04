import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { httpClient } from '@/lib/HttpClient';

const expenseIncomeServices = {
  getCategories: async (): Promise<Category[]> => {
    return httpClient.get<Category[]>('/categories');
  },
  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    return httpClient.post<Category>('/categories', category);
  },
  updateCategory: async (category: Category): Promise<Category> => {
    return httpClient.put<Category>(`/categories/${category.id}`, category);
  },
  deleteCategory: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/categories/${id}`);
  },
};

export default expenseIncomeServices;
