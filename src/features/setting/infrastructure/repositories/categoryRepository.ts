import { Category, CategoryType } from '@prisma/client';
import { ICategoryRepository } from '@/features/setting/domain/repositories/categoryRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class CategoryRepository implements ICategoryRepository {
  async createCategory(data: {
    userId: string;
    type: CategoryType;
    icon: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
  }): Promise<Category> {
    return prisma.category.create({ data });
  }

  async findCategoriesByUserId(userId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId },
      include: { subCategories: true },
    });
  }

  async findCategoryById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}

// Export a single instance
export const categoryRepository = new CategoryRepository();
