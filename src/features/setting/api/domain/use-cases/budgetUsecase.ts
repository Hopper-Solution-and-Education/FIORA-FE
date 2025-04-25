import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import {
  BudgetDetailType,
  BudgetsTable,
  BudgetType,
  Currency,
  Prisma,
  TransactionType,
} from '@prisma/client';
import _ from 'lodash';
import { budgetDetailRepository } from '../../infrastructure/repositories/budgetDetailRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';
import { IBudgetDetailRepository } from '../../repositories/budgetDetailRepository';
import {
  BudgetCreation,
  BudgetGetAnnualYearParams,
  IBudgetRepository,
} from '../../repositories/budgetRepository';

class BudgetUseCase {
  private budgetRepository: IBudgetRepository;
  private budgetDetailRepository: IBudgetDetailRepository;
  private transactionRepository: ITransactionRepository;

  constructor(
    budgetRepository: IBudgetRepository,
    budgetDetailRepository: IBudgetDetailRepository,
    transactionRepository: ITransactionRepository,
  ) {
    this.budgetRepository = budgetRepository;
    this.budgetDetailRepository = budgetDetailRepository;
    this.transactionRepository = transactionRepository;
  }

  async createBudget(params: BudgetCreation) {
    const {
      userId,
      fiscalYear,
      description,
      estimatedTotalExpense,
      estimatedTotalIncome,
      icon,
      currency,
    } = params;

    const transactions = await this.transactionRepository.findManyTransactions(
      {
        userId,
        date: {
          gte: new Date(`${fiscalYear}-01-01`),
          lte: new Date(`${fiscalYear}-12-31`),
        },
        isDeleted: false,
      },
      {
        select: {
          type: true,
          amount: true,
          currency: true,
        },
      },
    );

    // Calculate total income and expense for 'Act' budget with currency conversion
    const totalExpenseAct = transactions
      .filter((t) => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    const totalIncomeAct = transactions
      .filter((t) => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency as Currency, currency), 0);

    // Step 2: Define budget data for all three types
    const budgetTypesData: {
      type: BudgetsTable['type'];
      totalExpense: number;
      totalIncome: number;
    }[] = [
      { type: 'Top', totalExpense: estimatedTotalExpense, totalIncome: estimatedTotalIncome },
      { type: 'Bot', totalExpense: estimatedTotalExpense, totalIncome: estimatedTotalIncome },
      { type: 'Act', totalExpense: totalExpenseAct, totalIncome: totalIncomeAct },
    ];

    // Create budget details for each month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Quarterly fields
    const quarters = {
      q1: [1, 2, 3],
      q2: [4, 5, 6],
      q3: [7, 8, 9],
      q4: [10, 11, 12],
    };

    const createdBudgets: BudgetsTable[] = [];

    // Step 3: Create budgets for each type
    for (const { type, totalExpense, totalIncome } of budgetTypesData) {
      const monthlyExpense = _.round(totalExpense / 12, 2);
      const monthlyIncome = _.round(totalIncome / 12, 2);

      // Monthly fields
      const monthFields = months.reduce<Record<string, number>>((acc, m) => {
        acc[`m${m}_exp`] = monthlyExpense;
        acc[`m${m}_inc`] = monthlyIncome;
        return acc;
      }, {});

      // Quarterly fields
      const quarterFields = Object.entries(quarters).reduce<Record<string, number>>(
        (acc, [q, ms]) => {
          acc[`${q}_exp`] = _.round(ms.length * monthlyExpense, 2);
          acc[`${q}_inc`] = _.round(ms.length * monthlyIncome, 2);
          return acc;
        },
        {},
      );

      // Half-year totals
      const h1_exp = _.round(monthlyExpense * 6, 2);
      const h2_exp = _.round(monthlyExpense * 6, 2);
      const h1_inc = _.round(monthlyIncome * 6, 2);
      const h2_inc = _.round(monthlyIncome * 6, 2);

      // Create Budget
      const newBudget = await this.budgetRepository.createBudget({
        userId,
        icon,
        fiscalYear,
        type,
        total_exp: totalExpense,
        total_inc: totalIncome,
        h1_exp,
        h2_exp,
        h1_inc,
        h2_inc,
        ...quarterFields,
        ...monthFields,
        createdBy: userId,
        description,
        currency,
      });

      // Create BudgetDetails (24 rows)
      const detailData = months.flatMap((month) => [
        {
          userId,
          budgetId: newBudget.id,
          type: BudgetDetailType.Expense,
          amount: monthlyExpense,
          month,
          createdBy: userId,
        },
        {
          userId,
          budgetId: newBudget.id,
          type: BudgetDetailType.Income,
          amount: monthlyIncome,
          month,
          createdBy: userId,
        },
      ]);

      const createdBudgetDetailRes =
        await this.budgetDetailRepository.createManyBudgetDetails(detailData);

      if (!createdBudgetDetailRes) {
        throw new Error(Messages.BUDGET_DETAILS_CREATE_FAILED);
      }
      createdBudgets.push(newBudget);
    }

    return createdBudgets;
  }

  async getAnnualBudgetByYears(params: BudgetGetAnnualYearParams) {
    const { userId, cursor = null, take, currency, search } = params;

    const currentYear = new Date().getFullYear(); // 2025

    let where = {
      userId,
      fiscalYear: {
        lte: currentYear, // Allow up to next year,
        ...(cursor && { lt: cursor }), // Use cursor for pagination
      },
    } as Prisma.BudgetsTableWhereInput;

    if (search) {
      where = {
        ...where,
        fiscalYear: { equals: Number(search) },
      };
    }

    // Step 1.1: Check if budgets exist for the current year
    const currentYearBudgets = await this.budgetRepository.findManyBudgetData(
      {
        userId: userId,
        fiscalYear: currentYear,
      },
      {
        select: {
          fiscalYear: true,
          type: true,
        },
      },
    );

    // Step 2.1: If no budgets for the current year, create them
    if (currentYearBudgets.length === 0) {
      // Find the most recent past year's budgets
      const latestPastBudgets = await this.budgetRepository.findManyBudgetData(
        {
          userId: userId,
          fiscalYear: { lt: currentYear },
        },
        {
          select: {
            fiscalYear: true,
            type: true,
            total_inc: true,
            total_exp: true,
            description: true,
            currency: true,
          },
          orderBy: { fiscalYear: 'desc' },
          take: 3, // Get budgets for the most recent year (Top, Bot, Act)
        },
      );

      if (latestPastBudgets.length > 0) {
        const topBudget = latestPastBudgets.find((b) => b.type === BudgetType.Top);
        const currency = topBudget?.currency || Currency.VND; // Default to VND if not found
        const description = topBudget?.description || 'Auto-generated budget';

        // Create budgets for the current year using the most recent past year's data
        // For Act, createBudget will fetch current year's transactions
        await this.createBudget({
          userId: userId,
          fiscalYear: currentYear, // Use current year
          estimatedTotalExpense: topBudget?.total_exp.toNumber() || 0,
          estimatedTotalIncome: topBudget?.total_inc.toNumber() || 0,
          description: description,
          currency: currency, // Use the currency from the latest past budget
        });
      }
    }

    // Step 3: Fetch distinct years with budgets, sorted descending
    const distinctYears = await this.budgetRepository.findManyBudgetData(where, {
      select: {
        fiscalYear: true,
      },
      distinct: ['fiscalYear'], // Get unique years
      orderBy: {
        fiscalYear: 'desc',
      },
      take: take, // Take 3 distinct years
    });

    const years = distinctYears.map((d) => d.fiscalYear);

    // Step 3: Fetch budgets for the user with pagination, from current year and earlier
    const budgets = await this.budgetRepository.findManyBudgetData(where, {
      select: {
        id: true,
        fiscalYear: true,
        total_inc: true,
        total_exp: true,
        currency: true,
        createdAt: true,
        type: true,
      },
      orderBy: {
        fiscalYear: 'desc', // Sort by year in descending order
      },
    });

    // Step 4: Group budgets by year and extract Top, Bot, Act
    const budgetsByYear = budgets.reduce(
      (
        acc: Record<number, Record<string, { total_inc: any; total_exp: any; currency: string }>>,
        budget,
      ) => {
        if (!acc[budget.fiscalYear]) {
          acc[budget.fiscalYear] = {};
        }
        acc[budget.fiscalYear][budget.type] = {
          total_inc: budget.total_inc,
          total_exp: budget.total_exp,
          currency: budget.currency,
        };
        return acc;
      },
      {},
    );

    // Step 5: Fetch actual transactions for the selected years
    const transactions = await this.transactionRepository.findManyTransactions(
      {
        userId: userId,
        isDeleted: false,
        date: {
          gte: new Date(`${Math.min(...years)}-01-01`),
          lte: new Date(`${Math.max(...years)}-12-31`),
        },
      },
      {
        select: {
          date: true,
          type: true,
          amount: true,
          currency: true,
        },
      },
    );

    // Step 6: Process transactions to calculate actual income/expense per year
    const actualDataByYear = transactions.reduce(
      (acc: Record<number, { budgetActIncome: number; budgetActExpense: number }>, transaction) => {
        const year = new Date(transaction.date).getFullYear();
        if (!acc[year]) {
          acc[year] = { budgetActIncome: 0, budgetActExpense: 0 };
        }

        const convertedAmount = convertCurrency(
          transaction.amount,
          transaction.currency as Currency,
          currency,
        );
        if (transaction.type === TransactionType.Income) {
          acc[year].budgetActIncome += convertedAmount;
        } else if (transaction.type === TransactionType.Expense) {
          acc[year].budgetActExpense += convertedAmount;
        }
        return acc;
      },
      {},
    );

    // Step 7: Combine budget and actual data into the desired response format
    const response = years.map((year) => {
      const budgetData = budgetsByYear[year] || {};
      const topData = budgetData[BudgetType.Top] || {
        total_inc: 0,
        total_exp: 0,
        currency: Currency.VND,
      };
      const botData = budgetData[BudgetType.Bot] || {
        total_inc: 0,
        total_exp: 0,
        currency: Currency.VND,
      };
      const actualData = actualDataByYear[year] || {
        budgetActIncome: 0,
        budgetActExpense: 0,
      };

      return {
        year: year,
        budgetTopIncome: convertCurrency(topData.total_inc, topData.currency as Currency, currency),
        budgetTopExpense: convertCurrency(
          topData.total_exp,
          topData.currency as Currency,
          currency,
        ),
        budgetBotIncome: convertCurrency(botData.total_inc, botData.currency as Currency, currency),
        budgetBotExpense: convertCurrency(
          botData.total_exp,
          botData.currency as Currency,
          currency,
        ),
        budgetActIncome: Number(actualData.budgetActIncome.toFixed(2)),
        budgetActExpense: Number(actualData.budgetActExpense.toFixed(2)),
      };
    });

    // Step 9: Include the next cursor in the response
    const nextCursor = response.length === take ? response[response.length - 1].year : null;

    return {
      data: response,
      nextCursor,
      currency: currency,
    } as const;
  }

  async checkedDuplicated(userId: string, fiscalYear: number): Promise<boolean> {
    const foundBudget = await this.budgetRepository.findBudgetData({
      userId,
      fiscalYear,
    });
    if (foundBudget) {
      return true;
    }
    return false;
  }

  async checkedDuplicated(userId: string, fiscalYear: number): Promise<boolean> {
    const foundBudget = await this.budgetRepository.findBudgetData({
      userId,
      fiscalYear,
    });
    if (foundBudget) {
      return true;
    }
    return false;
  }
}

export const budgetUseCase = new BudgetUseCase(
  budgetRepository,
  budgetDetailRepository,
  transactionRepository,
);
