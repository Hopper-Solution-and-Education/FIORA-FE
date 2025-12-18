import { ICategoryRepository } from '@/features/setting/api/repositories/categoryRepository.interface';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants';
import { BadRequestError } from '@/shared/lib';
import { CategoryExtras, GlobalFilters } from '@/shared/types';
import { buildWhereClause } from '@/shared/utils';
import { Category, CategoryType, Prisma } from '@prisma/client';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';

class CategoryUseCase {
  private categoryRepository: ICategoryRepository;
  private transactionRepository: ITransactionRepository;

  constructor(repository: ICategoryRepository, transactionRepository: ITransactionRepository) {
    this.categoryRepository = repository;
    this.transactionRepository = transactionRepository;
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
      throw new BadRequestError(Messages.INVALID_CATEGORY_TYPE);
    }
    if (!name || !icon) {
      throw new BadRequestError(Messages.INVALID_CATEGORY_REQUIRED);
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

  async updateCategory(id: string, userId: string, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new BadRequestError(Messages.CATEGORY_NOT_FOUND);
    }
    if (data.type && !Object.values(CategoryType).includes(data.type)) {
      throw new BadRequestError(Messages.INVALID_CATEGORY_TYPE);
    }
    return this.categoryRepository.updateCategory(id, { ...data, updatedBy: userId });
  }

  async deleteCategory(id: string, userId: string, newId?: string): Promise<void> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new BadRequestError(Messages.CATEGORY_NOT_FOUND);
    }

    if (newId) {
      const newCategory = await this.categoryRepository.findCategoryById(newId);
      if (!newCategory || newCategory.userId !== userId) {
        throw new BadRequestError(Messages.CATEGORY_NOT_FOUND);
      }
      await this.transactionRepository.updateTransactionsCategory(id, newId);
    }

    await this.categoryRepository.deleteCategory(id);
  }

  async getCategories(userId: string, params: GlobalFilters): Promise<any[]> {
    let where: Prisma.CategoryWhereInput = {};

    if (params.filters && Object.keys(params.filters).length > 0) {
      where = buildWhereClause(params.filters) as Prisma.CategoryWhereInput;
    }
    const categories = await this.categoryRepository.findCategoriesWithTransactionsFilter(
      userId,
      where,
    );

    const calculateBalance = (category: CategoryExtras): number => {
      if (category.type === CategoryType.Expense.valueOf()) {
        return (category.toTransactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);
      } else if (category.type === CategoryType.Income.valueOf()) {
        return (category.fromTransactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);
      }
      return 0;
    };

    const categoryMap = new Map<string, any>();
    categories.forEach((category: any) => {
      categoryMap.set(category.id, {
        ...category,
        balance: calculateBalance(category),
      });
    });

    categories.forEach((category: any) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.balance += categoryMap.get(category.id).balance;
        }
      }
    });

    return Array.from(categoryMap.values());
  }
}

// Export a single instance using the exported categoryRepository
export const categoryUseCase = new CategoryUseCase(categoryRepository, transactionRepository);
