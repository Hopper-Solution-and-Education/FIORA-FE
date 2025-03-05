import { Category, CategoryType } from '@prisma/client';
import { ICategoryRepository } from '@/features/setting/domain/repositories/categoryRepository.interface';
import { categoryRepository } from '@/features/setting/infrastructure/repositories/categoryRepository';

class CategoryUseCase {
  private categoryRepository: ICategoryRepository;

  constructor(repository: ICategoryRepository) {
    this.categoryRepository = repository;
  }

  async createCategory(data: {
    userId: string;
    type: CategoryType;
    icon: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
  }): Promise<Category> {
    if (!Object.values(CategoryType).includes(data.type)) {
      throw new Error('Loại danh mục không hợp lệ. Phải là "Expense" hoặc "Income"');
    }
    if (!data.name || !data.icon) {
      throw new Error('Tên và biểu tượng là bắt buộc');
    }
    return this.categoryRepository.createCategory(data);
  }

  async getCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.findCategoriesByUserId(userId);
  }

  async updateCategory(id: string, userId: string, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new Error('Danh mục không tồn tại hoặc không thuộc về bạn');
    }
    if (data.type && !Object.values(CategoryType).includes(data.type)) {
      throw new Error('Loại danh mục không hợp lệ. Phải là "Expense" hoặc "Income"');
    }
    return this.categoryRepository.updateCategory(id, data);
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new Error('Danh mục không tồn tại hoặc không thuộc về bạn');
    }
    await this.categoryRepository.deleteCategory(id);
  }
}

// Export a single instance using the exported categoryRepository
export const categoryUseCase = new CategoryUseCase(categoryRepository);
