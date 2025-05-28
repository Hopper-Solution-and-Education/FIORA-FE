import { Category, CategoryType, Prisma } from '@prisma/client';
import { categoryRepository } from '@/features/setting/api/infrastructure/repositories/categoryRepository';
import { CategoryExtras } from '@/shared/types/category.types';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';
import { safeString } from '@/shared/utils/ExStringUtils';
import { GlobalFilters } from '@/shared/types';
import { buildWhereClause } from '@/shared/utils';
import { BooleanUtils } from '@/shared/lib';

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
      throw new Error(Messages.INVALID_CATEGORY_TYPE);
    }
    if (!name || !icon) {
      throw new Error(Messages.INVALID_CATEGORY_REQUIRED);
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
      throw new Error(Messages.CATEGORY_NOT_FOUND);
    }
    if (data.type && !Object.values(CategoryType).includes(data.type)) {
      throw new Error(Messages.INVALID_CATEGORY_TYPE);
    }
    return this.categoryRepository.updateCategory(id, { ...data, updatedBy: userId });
  }

  async deleteCategory(id: string, userId: string, newId?: string): Promise<void> {
    const category = await this.categoryRepository.findCategoryById(id);
    if (!category || category.userId !== userId) {
      throw new Error(Messages.CATEGORY_NOT_FOUND);
    }

    if (newId) {
      const newCategory = await this.categoryRepository.findCategoryById(newId);
      if (!newCategory || newCategory.userId !== userId) {
        throw new Error(Messages.CATEGORY_NOT_FOUND);
      }
      await this.transactionRepository.updateTransactionsCategory(id, newId);
    }

    await this.categoryRepository.deleteCategory(id);
  }

  private extractTransactionRangeFilters(filters: any): {
    totalIncomeMin?: number;
    totalIncomeMax?: number;
    totalExpenseMin?: number;
    totalExpenseMax?: number;
  } {
    const result: any = {};

    const transactionsFilter = filters?.transactions?.some?.OR ?? [];
    transactionsFilter.forEach((condition: any) => {
      if (condition.type === 'Income') {
        result.totalIncomeMin = condition.amount?.gte ?? 0;
        result.totalIncomeMax = condition.amount?.lte ?? Number.MAX_SAFE_INTEGER;
      } else if (condition.type === 'Expense') {
        result.totalExpenseMin = condition.amount?.gte ?? 0;
        result.totalExpenseMax = condition.amount?.lte ?? Number.MAX_SAFE_INTEGER;
      }
    });

    return result;
  }

  private filterCategoriesByTransactionRange(categories: any[], filters: any): any[] {
    const {
      totalIncomeMin = 0,
      totalIncomeMax = Number.MAX_SAFE_INTEGER,
      totalExpenseMin = 0,
      totalExpenseMax = Number.MAX_SAFE_INTEGER,
    } = filters;

    return categories.filter((category) => {
      const balance = category.balance ?? 0;
      if (category.type === 'Income') {
        return balance >= totalIncomeMin && balance <= totalIncomeMax;
      } else if (category.type === 'Expense') {
        return balance >= totalExpenseMin && balance <= totalExpenseMax;
      }
      return true;
    });
  }

  async getCategories(userId: string, params: GlobalFilters): Promise<any[]> {
    const searchParams = safeString(params.search);
    let where: Prisma.CategoryWhereInput = {};
    delete params.filters?.transactions;

    if (params.filters && Object.keys(params.filters).length > 0) {
      where = buildWhereClause(params.filters) as Prisma.CategoryWhereInput;
    }

    if (BooleanUtils.isTrue(searchParams)) {
      const typeSearchParams = searchParams.toLowerCase();

      where = {
        AND: [
          where,
          {
            OR: [{ name: { contains: typeSearchParams, mode: 'insensitive' } }],
          },
        ],
      };
    }

    let categories = await this.categoryRepository.findCategoriesWithTransactions(userId, where);
    const transactionRangeFilters = this.extractTransactionRangeFilters(params.filters);
    categories = this.filterCategoriesByTransactionRange(categories, transactionRangeFilters);

    const calculateBalance = (category: CategoryExtras): number => {
      if (category.type === CategoryType.Expense.valueOf()) {
        return (category.toTransactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);
      } else if (category.type === CategoryType.Income.valueOf()) {
        return (category.fromTransactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);
      }
      return 0;
    };

    const categoryMap = new Map<string, any>();
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        balance: calculateBalance(category),
      });
    });

    categories.forEach((category) => {
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
