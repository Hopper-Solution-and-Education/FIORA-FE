import { prisma } from '@/config';
import { categoryRepository } from '@/features/setting/api/infrastructure/repositories/categoryRepository';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { DEFAULT_BASE_CURRENCY } from '@/shared/constants';
import { Messages } from '@/shared/constants/message';
import { BooleanUtils } from '@/shared/lib';
import { CategoryFilters } from '@/shared/types';
import { FetchTransactionResponse } from '@/shared/types/budget.types';
import { CategoryExtras, CategoryWithBudgetDetails } from '@/shared/types/category.types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { normalizeVietnamese, safeString } from '@/shared/utils/ExStringUtils';
import { calculateSumUpAllocationByType } from '@/shared/utils/monthBudgetUtil';
import {
  BudgetType,
  Category,
  CategoryType,
  Prisma,
  Transaction,
  TransactionType,
} from '@prisma/client';
import { budgetDetailRepository } from '../../infrastructure/repositories/budgetDetailRepository';
import { IBudgetDetailRepository } from '../../repositories/budgetDetailRepository';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';

class CategoryUseCase {
  private categoryRepository: ICategoryRepository;
  private transactionRepository: ITransactionRepository;
  private budgetDetailRepository: IBudgetDetailRepository;

  constructor(
    repository: ICategoryRepository,
    transactionRepository: ITransactionRepository,
    budgetDetailRepository: IBudgetDetailRepository,
  ) {
    this.categoryRepository = repository;
    this.transactionRepository = transactionRepository;
    this.budgetDetailRepository = budgetDetailRepository;
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
        return (category.toTransactions ?? []).reduce(
          // Get baseAmount from transaction
          (sum: any, tx: any) => sum + Number(tx.baseAmount),
          0,
        );
      } else if (category.type === CategoryType.Income.valueOf()) {
        return (category.fromTransactions ?? []).reduce(
          // Get baseAmount from transaction
          (sum: any, tx: any) => sum + Number(tx.baseAmount),
          0,
        );
      }
      return 0;
    };

    const categoryMap = new Map<string, any>();
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        balance: calculateBalance(category),
        currency: DEFAULT_BASE_CURRENCY,
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

  async getCategoriesFilter(
    userId: string,
    params: CategoryFilters,
  ): Promise<{
    data: any[];
    minAmount: number;
    maxAmount: number;
  }> {
    const searchParams = safeString(params.search);
    const where: Prisma.CategoryWhereInput = {};
    let categories;

    if (BooleanUtils.isTrue(searchParams)) {
      try {
        const normalizedSearch = normalizeVietnamese(searchParams);

        const rawCategories = (await prisma.$queryRaw`
          SELECT c.* FROM "Category" c
          WHERE 
            c."userId"::text = ${userId}::text
            AND unaccent(c."name") ILIKE unaccent('%' || ${normalizedSearch.toLowerCase()} || '%')
        `) as any;

        categories = await Promise.all(
          rawCategories.map(async (category: any) => {
            const [toTransactions, fromTransactions] = await Promise.all([
              prisma.transaction.findMany({
                where: { toCategoryId: category.id, isDeleted: false },
              }),
              prisma.transaction.findMany({
                where: { fromCategoryId: category.id, isDeleted: false },
              }),
            ]);
            return { ...category, toTransactions, fromTransactions };
          }),
        );
      } catch (error) {
        console.error('Search failed:', error);
        categories = [];
      }
    } else {
      categories = await this.categoryRepository.findCategoriesWithTransactionsFilter(
        userId,
        where,
      );
    }

    const transactionRangeFilters = this.extractTransactionRangeFilters(params.filters);

    categories = this.filterCategoriesByTransactionRange(categories, transactionRangeFilters);

    const calculateBalance = (category: CategoryExtras): number => {
      if (category.type === CategoryType.Expense.valueOf()) {
        return (category.toTransactions ?? []).reduce(
          (sum: any, tx: any) => sum + Number(tx.baseAmount),
          0,
        );
      } else if (category.type === CategoryType.Income.valueOf()) {
        return (category.fromTransactions ?? []).reduce(
          (sum: any, tx: any) => sum + Number(tx.baseAmount),
          0,
        );
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
    const categoriesWithBalance = Array.from(categoryMap.values());
    const { minAmount, maxAmount } = this.calculateMinMaxTotalAmount(categoriesWithBalance);

    return {
      data: categoriesWithBalance,
      minAmount,
      maxAmount,
    };
  }

  private filterCategoriesByTransactionRange(categories: any[], filters: any): any[] {
    const {
      totalIncomeMin = 0,
      totalIncomeMax = Number.MAX_SAFE_INTEGER,
      totalExpenseMin = 0,
      totalExpenseMax = Number.MAX_SAFE_INTEGER,
    } = filters;

    return categories.filter((category) => {
      const fromTransactions = category.fromTransactions ?? [];
      const toTransactions = category.toTransactions ?? [];

      const totalIncome = fromTransactions.reduce(
        (sum: number, tx: any) => sum + Number(tx.baseAmount),
        0,
      );

      const totalExpense = toTransactions.reduce(
        (sum: number, tx: any) => sum + Number(tx.baseAmount),
        0,
      );

      const isValidIncome =
        category.type === 'Income' &&
        totalIncome >= totalIncomeMin &&
        totalIncome <= totalIncomeMax;

      const isValidExpense =
        category.type === 'Expense' &&
        totalExpense >= totalExpenseMin &&
        totalExpense <= totalExpenseMax;

      return isValidIncome || isValidExpense;
    });
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
        result.totalIncomeMin = condition.AND.at(0).baseAmount.gte
          ? condition.AND.at(0).baseAmount.gte
          : 0;
        result.totalIncomeMax = condition.AND.at(0).baseAmount.lte
          ? condition.AND.at(0).baseAmount.lte
          : Number.MAX_SAFE_INTEGER;
      } else if (condition.type === 'Expense') {
        result.totalExpenseMin = condition.AND.at(0).baseAmount.gte
          ? condition.AND.at(0).baseAmount.gte
          : 0;
        result.totalExpenseMax = condition.AND.at(0).baseAmount.lte
          ? condition.AND.at(0).baseAmount.lte
          : Number.MAX_SAFE_INTEGER;
      }
    });

    return result;
  }

  private calculateMinMaxTotalAmount(categories: CategoryExtras[]): {
    minAmount: number;
    maxAmount: number;
  } {
    const totalAmounts = categories.map((category) => {
      const fromSum = (category.fromTransactions ?? []).reduce(
        (sum: any, tx: any) => sum + Number(tx.amount),
        0,
      );
      const toSum = (category.toTransactions ?? []).reduce(
        (sum: any, tx: any) => sum + Number(tx.amount),
        0,
      );
      return fromSum + toSum;
    });

    const individualAmounts = categories.flatMap((category) =>
      [...(category.fromTransactions ?? []), ...(category.toTransactions ?? [])].map((tx) =>
        Number(tx.amount),
      ),
    );

    const maxAmount = totalAmounts.length > 0 ? Math.max(...totalAmounts) : 0;
    const minAmount = individualAmounts.length > 0 ? Math.min(...individualAmounts) : 0;

    return { minAmount, maxAmount };
  }

  private async calculateActualTotals(
    transactions: FetchTransactionResponse[] | [],
    currency: string,
  ): Promise<{ totalExpenseAct: number; totalIncomeAct: number }> {
    const expenseTransactions = transactions.filter((t) => t.type === TransactionType.Expense);
    const incomeTransactions = transactions.filter((t) => t.type === TransactionType.Income);

    const totalExpenseAct = (
      await Promise.all(
        expenseTransactions.map((t) => convertCurrency(t.amount.toNumber(), t.currency!, currency)),
      )
    ).reduce((sum, amount) => sum + amount, 0);

    const totalIncomeAct = (
      await Promise.all(
        incomeTransactions.map((t) => convertCurrency(t.amount.toNumber(), t.currency!, currency)),
      )
    ).reduce((sum, amount) => sum + amount, 0);

    return { totalExpenseAct, totalIncomeAct };
  }

  async getTransactionsByCategoryIdAndYear(
    categoryId: string,
    year: number,
    userId: string,
    currency: string,
  ) {
    // checked if categoryId is valid
    const foundCategory = await this.categoryRepository.findFirstCategory({
      id: categoryId,
      userId,
    });

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

    const { totalExpenseAct, totalIncomeAct } = await this.calculateActualTotals(
      foundTransactions,
      currency,
    );

    const { monthFields, quarterFields, halfYearFields } = await calculateSumUpAllocationByType(
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
      currency: currency,
      type: foundCategory.type,
    };
  }

  async getListCategoryByType(userId: string, type: CategoryType, fiscalYear: string) {
    if (!Object.values(CategoryType).includes(type)) {
      throw new Error(Messages.INVALID_CATEGORY_TYPE);
    }

    // Find all categories mapping with userId and type
    const categoryFound = (await this.categoryRepository.findManyCategory(
      {
        userId,
        type,
      },
      {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    )) as unknown as Category[];

    let categoryFoundWithBudgetDetails = [];
    let categoryFoundWithTransactions = [];

    // find all budgetDetails mapping with userId & budgetId & categoryType ( Expense or Income )
    const categoryFoundWithBudgetDetailsAwaited = categoryFound.map(async (category: Category) => {
      const budgetDetailsFound = await this.budgetDetailRepository.findManyBudgetDetails(
        {
          userId,
          budget: {
            fiscalYear: {
              equals: fiscalYear,
            },
            type: BudgetType.Bot,
            userId: userId,
          },
          categoryId: category.id,
          type: type,
        },
        {
          select: {
            month: true,
            amount: true,
            currency: true,
          },
        },
      );
      return {
        ...category,
        budgetDetails: budgetDetailsFound,
      };
    });

    // find all transactions mapping with userId & categoryId & type
    const categoryFoundWithTransactionsAwaited = categoryFound.map(async (category: Category) => {
      const transactionsFound = await this.transactionRepository.findManyTransactions({
        userId,
        ...(type === CategoryType.Expense
          ? { toCategoryId: category.id }
          : { fromCategoryId: category.id }),
        isDeleted: false,
        date: {
          gte: new Date(`${fiscalYear}-01-01`),
          lte: new Date(`${fiscalYear}-12-31`),
        },
      });
      return {
        ...category,
        transactions: transactionsFound,
      };
    });

    categoryFoundWithBudgetDetails = await Promise.all(categoryFoundWithBudgetDetailsAwaited);
    categoryFoundWithTransactions = await Promise.all(categoryFoundWithTransactionsAwaited);

    const transferCategoryFound = categoryFoundWithBudgetDetails.map(
      (category: CategoryWithBudgetDetails) => {
        const suffix = category.type === CategoryType.Expense ? 'exp' : 'inc';
        const bottomUpPlan: Record<string, number> = {};
        const actualTransaction: Record<string, number | string | TransactionType> = {};

        // Initialize all months with 0
        for (let i = 1; i <= 12; i++) {
          bottomUpPlan[`m${i}_${suffix}`] = 0;
          actualTransaction[`m${i}_${suffix}`] = 0;
        }

        // Map budgetDetails to corresponding months
        category.budgetDetails.forEach((detail: any) => {
          const monthKey = `m${detail.month}_${suffix}`;
          // Convert amount from string to number and apply currency conversion if needed
          const amount = Number(detail.amount);
          bottomUpPlan[monthKey] = amount; // Assuming no currency conversion for now; adjust if needed
        });

        // Map actual transaction to corresponding months
        categoryFoundWithTransactions.forEach(async (item: any) => {
          if (item.id === category.id) {
            actualTransaction[`total_${suffix}`] = 0;
            actualTransaction[`currency`] = item.currency;
            actualTransaction[`type`] = item.type as TransactionType;
            item.transactions.forEach(async (transaction: Transaction) => {
              const monthKey = `m${transaction.date.getMonth() + 1}_${suffix}`; // Get month key from transaction date

              actualTransaction[monthKey] =
                Number(actualTransaction[monthKey]) + Number(transaction.amount); // Sum up amount of transaction in the month
              actualTransaction[`total_${suffix}`] =
                Number(actualTransaction[`total_${suffix}`]) + Number(transaction.amount); // Sum up amount of transaction in the year
            });
          }
        });

        const { budgetDetails, ...categoryWithoutBudgetDetails } = category;

        return {
          ...categoryWithoutBudgetDetails,
          bottomUpPlan,
          actualTransaction: {
            ...actualTransaction,
          },
          isCreated: budgetDetails.length > 0 || Number(actualTransaction[`total_${suffix}`]) > 0,
        };
      },
    );

    return transferCategoryFound ?? [];
  }
}

// Export a single instance using the exported categoryRepository
export const categoryUseCase = new CategoryUseCase(
  categoryRepository,
  transactionRepository,
  budgetDetailRepository,
);
