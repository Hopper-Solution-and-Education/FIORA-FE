import { categoryRepository } from '@/features/setting/api/infrastructure/repositories/categoryRepository';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { FetchTransactionResponse } from '@/shared/types/budget.types';
import { CategoryExtras } from '@/shared/types/category.types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { calculateSumUpAllocationByType } from '@/shared/utils/monthBudgetUtil';
import { Category, CategoryType, Currency, TransactionType } from '@prisma/client';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';

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

  async getCategories(userId: string) {
    const categories = await this.categoryRepository.findCategoriesWithTransactions(userId);

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

  private calculateActualTotals(
    transactions: FetchTransactionResponse[] | [],
    currency: Currency,
  ): { totalExpenseAct: number; totalIncomeAct: number } {
    const totalExpenseAct = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    const totalIncomeAct = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);
    return { totalExpenseAct, totalIncomeAct };
  }

  async getTransactionsByCategoryIdAndYear(
    categoryId: string,
    year: number,
    userId: string,
    currency: Currency,
  ) {
    // checked if categoryId is valid
    const foundCategory = await this.categoryRepository.findCategoryById(categoryId);

    if (!foundCategory) {
      throw new Error(Messages.CATEGORY_NOT_FOUND);
    }

    const suffix = foundCategory.type === CategoryType.Expense ? 'exp' : 'inc';

    const foundTransactions = await this.transactionRepository.findManyTransactions({
      userId,
      isDeleted: false,
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
      ...(foundCategory.type === CategoryType.Expense
        ? { toCategoryId: foundCategory.id }
        : { fromCategoryId: foundCategory.id }),
    });

    const { totalExpenseAct, totalIncomeAct } = this.calculateActualTotals(
      foundTransactions,
      currency,
    );

    const { monthFields, quarterFields, halfYearFields } = calculateSumUpAllocationByType(
      foundTransactions,
      year,
      foundCategory,
      currency,
    );

    const totalMapping =
      foundCategory.type === CategoryType.Expense ? totalExpenseAct : totalIncomeAct;

    return {
      ...monthFields,
      ...quarterFields,
      ...halfYearFields,
      [`total_${suffix}`]: totalMapping,
      currency,
      type: foundCategory.type,
    };
  }

  async getListCategoryByType(userId: string, type: CategoryType): Promise<Category[] | []> {
    if (!Object.values(CategoryType).includes(type)) {
      throw new Error(Messages.INVALID_CATEGORY_TYPE);
    }

    const categoryFound = this.categoryRepository.findManyCategory(
      {
        userId,
        type,
      },
      {
        select: {
          id: true,
          name: true,
          icon: true,
          type: true,
        },
      },
    );

    return categoryFound ?? [];
  }
}

// Export a single instance using the exported categoryRepository
export const categoryUseCase = new CategoryUseCase(categoryRepository, transactionRepository);
