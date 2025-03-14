import { Category, CategoryType } from '@prisma/client';

export interface ICategoryRepository {
  createCategory(data: {
    userId: string;
    type: CategoryType;
    icon: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
    tax_rate: number;
    createdBy: string;
    updatedBy: string;
  }): Promise<Category>;
  findCategoriesByUserId(userId: string): Promise<Category[]>;
  findCategoryById(id: string): Promise<Category | null>;
  updateCategory(id: string, data: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}
