import { CategoryExtras } from '@/shared/types';
import { Category, CategoryType, Prisma } from '@prisma/client';

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
  /**
   * Updates a category and its direct child categories if the type changes.
   * @param id - The ID of the category to update
   * @param data - The new data for the category
   */
  updateCategory(id: string, data: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  findCategoriesWithTransactionsFilter(
    userId: string,
    where: Prisma.CategoryWhereInput,
  ): Promise<CategoryExtras[]>;

  findCategoriesWithTransactions(userId: string): Promise<CategoryExtras[]>;
}
