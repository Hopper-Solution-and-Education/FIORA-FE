import { Category, CategoryType } from '@prisma/client';

export interface ICategoryRepository {
  createCategory(data: {
    userId: string;
    type: CategoryType; // Use CategoryType instead of string
    icon: string;
    name: string;
    description?: string | null; // Match Prisma's optional string
    parentId?: string | null;
  }): Promise<Category>;
  findCategoriesByUserId(userId: string): Promise<Category[]>;
  findCategoryById(id: string): Promise<Category | null>;
  updateCategory(id: string, data: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  findCategoriesWithTransactions(userId: string): Promise<Category[]>;
}
