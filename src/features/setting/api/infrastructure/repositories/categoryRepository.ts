import { Category, CategoryType } from '@prisma/client';
import { prisma } from '@/config';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';

class CategoryRepository implements ICategoryRepository {
  async createCategory(data: {
    userId: string;
    type: CategoryType;
    icon: string;
    name: string;
    description?: string | null;
    parentId?: string | null;
  }): Promise<Category> {
    return prisma.category.create({
      data: {
        ...data,
        // tax_rate: 0,
        createdBy: data.userId,
      },
    });
  }

  async findCategoriesByUserId(userId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ type: 'asc' }, { parentId: 'asc' }],
    });
  }

  async findCategoryById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return prisma.$transaction(async (tx) => {
      // Fetch the current category to get the original type
      const currentCategory = await tx.category.findUnique({
        where: { id },
        select: { type: true },
      });

      if (!currentCategory) {
        throw new Error('Category not found');
      }

      const originalType = currentCategory.type;
      const newType = data.type;

      // Update the category with the new data
      const updatedCategory = await tx.category.update({
        where: { id },
        data,
      });

      // If the type has changed, update all direct child categories
      if (newType && originalType !== newType) {
        await tx.category.updateMany({
          where: { parentId: id },
          data: { type: newType },
        });
      }

      return updatedCategory;
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async findCategoriesWithTransactions(userId: string): Promise<any[]> {
    return prisma.category.findMany({
      where: {
        userId,
        toTransactions: { every: { isDeleted: false } },
        fromTransactions: { every: { isDeleted: false } },
      },
      include: {
        fromTransactions: { select: { amount: true } },
        toTransactions: { select: { amount: true } },
      },
      orderBy: [{ type: 'asc' }, { parentId: 'asc' }],
    });
  }
}

// Export a single instance
export const categoryRepository = new CategoryRepository();
