import { prisma } from '@/config';
import { Category, CategoryType, Prisma } from '@prisma/client';
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
      },
      include: {
        fromTransactions: { select: { amount: true, isDeleted: true } },
        toTransactions: { select: { amount: true, isDeleted: true } },
      },
      orderBy: [{ toTransactions: { _count: 'desc' } }, { fromTransactions: { _count: 'desc' } }],
    });
  }

  async findManyCategory(
    where: Prisma.CategoryWhereInput,
    options?: Prisma.CategoryFindManyArgs,
  ): Promise<Category[]> {
    return prisma.category.findMany({
      where,
      ...options,
    });
  }

  async findManyCategoryWithBudgetDetails(
    where: Prisma.CategoryWhereInput,
    options?: Prisma.CategoryFindManyArgs,
  ): Promise<Category[]> {
    const result = await prisma.category.findMany({
      where,
      ...options,
    });
    return result;
  }

  async findFirstCategory(
    where: Prisma.CategoryWhereInput,
    options?: Prisma.CategoryFindFirstArgs,
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where,
      ...options,
    });
  }

  async findCategoriesWithTransactionsFilter(
    userId: string,
    where: Prisma.CategoryWhereInput,
  ): Promise<any[]> {
    return prisma.category.findMany({
      where: {
        userId,
        ...where,
      },
      include: {
        fromTransactions: {
          where: {
            isDeleted: false,
          },
          select: {
            baseAmount: true,
            baseCurrency: true,
            amount: true,
            currency: true,
            isDeleted: true,
          },
        },
        toTransactions: {
          where: {
            isDeleted: false,
          },
          select: {
            baseAmount: true,
            baseCurrency: true,
            amount: true,
            currency: true,
            isDeleted: true,
          },
        },
      },
      orderBy: [{ toTransactions: { _count: 'desc' } }, { fromTransactions: { _count: 'desc' } }],
    });
  }
}

// Export a single instance
export const categoryRepository = new CategoryRepository();
