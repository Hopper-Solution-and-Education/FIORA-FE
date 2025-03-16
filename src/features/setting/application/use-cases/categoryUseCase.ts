import { Category, CategoryType } from '@prisma/client';
import { ICategoryRepository } from '@/features/setting/domain/repositories/categoryRepository.interface';
import { categoryRepository } from '@/features/setting/infrastructure/repositories/categoryRepository';

class CategoryUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(repository: ICategoryRepository) {
    this.categoryRepository = repository;
  }

  async createCategory(params: {
    userId: string;
    type: CategoryType;
    icon: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
  }): Promise<Category> {
    const { userId, type, icon, name, description, parentId } = params;
    if (!Object.values(CategoryType).includes(type)) {
      throw new Error('Category type is invalid. It must be Expense or Income');
    }
    if (!name || !icon) {
      throw new Error('Name and icon are required');
    }
    return this.categoryRepository.createCategory({
      userId,
      type,
      icon,
      name,
      description,
      parentId,
      tax_rate: 0,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async getCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.findCategoriesByUserId(userId);
  }

  async updateCategory(id: string, userId: string, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new Error('Category does not exist or does not belong to you');
    }
    if (data.type && !Object.values(CategoryType).includes(data.type)) {
      throw new Error('Category type is invalid. It must be Expense or Income');
    }
    return this.categoryRepository.updateCategory(id, { ...data, updatedBy: userId });
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new Error('Category does not exist or does not belong to you');
    }
    await this.categoryRepository.deleteCategory(id);
  }
}

// Export a single instance using the exported categoryRepository
export const categoryUseCase = new CategoryUseCase(categoryRepository);
