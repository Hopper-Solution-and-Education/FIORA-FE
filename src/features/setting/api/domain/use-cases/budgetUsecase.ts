import { prisma } from '@/config';
import { convertCurrency } from '@/shared/utils/currencyExchange';
import { BudgetDetailType, Prisma, TransactionType } from '@prisma/client';
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

  constructor(
    budgetRepository: IBudgetRepository,
    budgetDetailRepository: IBudgetDetailRepository,
  ) {
    this.budgetRepository = budgetRepository;
    this.budgetDetailRepository = budgetDetailRepository;
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

    const monthlyExpense = _.round(estimatedTotalExpense / 12, 2);
    const monthlyIncome = _.round(estimatedTotalIncome / 12, 2);

    // Create budget details for each month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Monthly fields
    const monthFields = months.reduce<Record<string, number>>((acc, m) => {
      acc[`m${m}_exp`] = monthlyExpense;
      acc[`m${m}_inc`] = monthlyIncome;
      return acc;
    }, {});

    // Quarterly fields
    const quarters = {
      q1: [1, 2, 3],
      q2: [4, 5, 6],
      q3: [7, 8, 9],
      q4: [10, 11, 12],
    };

    const quarterFields = Object.entries(quarters).reduce<Record<string, number>>(
      (acc, [q, ms]) => {
        acc[`${q}_exp`] = _.round(ms.length * monthlyExpense, 2);
        acc[`${q}_inc`] = _.round(ms.length * monthlyIncome, 2);
        return acc;
      },
      {},
    );

    // Half year totals
    const h1_exp = _.round(monthlyExpense * 6, 2);
    const h2_exp = _.round(monthlyExpense * 6, 2);
    const h1_inc = _.round(monthlyIncome * 6, 2);
    const h2_inc = _.round(monthlyIncome * 6, 2);

    // ---------------------------
    // Step 1: Create Budget
    // ---------------------------
    const newBudget = await this.budgetRepository.createBudget({
      userId,
      fiscalYear,
      icon,
      total_exp: estimatedTotalExpense,
      total_inc: estimatedTotalIncome,
      h1_exp,
      h2_exp,
      h1_inc,
      h2_inc,
      ...quarterFields,
      ...monthFields,
      description,
      currency,
      createdBy: userId,
    });

    // ---------------------------
    // Step 2: Create BudgetDetails (24 rows)
    // ---------------------------
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
    ]) as Prisma.BudgetDetailsCreateManyInput[];

    const budgetDetails = await this.budgetDetailRepository.createManyBudgetDetails(detailData);

    return {
      ...newBudget,
      budgetDetails,
    };
  }

  async getAnnualBudgetByYears(params: BudgetGetAnnualYearParams) {
    const { userId, cursor, take, currency, search } = params;

    let where = {
      userId,
      fiscalYear: cursor ? { gt: cursor } : undefined,
    } as Prisma.BudgetsTableWhereInput;

    if (search) {
      where = {
        ...where,
        fiscalYear: { equals: Number(search) },
      };
    }

    // Step 2: Fetch budgets for the user from BudgetsTable
    const budgets = await prisma.budgetsTable.findMany({
      where: where,
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
        fiscalYear: 'desc',
      },
      take: take,
    });

    // Step 3: Fetch actual transactions for the user, grouped by year
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        isDeleted: false, // Exclude deleted transactions
      },
      select: {
        date: true,
        type: true,
        amount: true,
        currency: true, // Include currency in the selection
      },
    });

    // Step 4: Process transactions to calculate actual income/expense per year
    const actualDataByYear = transactions.reduce(
      (acc: Record<number, { actualIncome: number; actualExpense: number }>, transaction) => {
        const year = new Date(transaction.date).getFullYear();
        if (!acc[year]) {
          acc[year] = { actualIncome: 0, actualExpense: 0 };
        }
        // Convert Prisma.Decimal to number before passing to convertCurrency
        const convertedAmount = convertCurrency(
          transaction.amount, // Prisma.Decimal is handled by convertCurrency
          transaction.currency,
          currency,
        );
        if (transaction.type === TransactionType.Income) {
          acc[year].actualIncome += convertedAmount;
        } else if (transaction.type === TransactionType.Expense) {
          acc[year].actualExpense += convertedAmount;
        }
        // Ignore 'Transfer' type as it doesn't contribute to income/expense directly
        return acc;
      },
      {},
    );

    // Step 5: Combine budget and actual data into the desired response format
    const response = budgets.map((budget) => {
      const year = budget.fiscalYear;
      const actualData = actualDataByYear[year] || {
        actualIncome: 0,
        actualExpense: 0,
      };

      // Convert Prisma.Decimal to number before passing to convertCurrency
      const convertedBudgetIncome = convertCurrency(
        budget.total_inc, // Prisma.Decimal is handled by convertCurrency
        budget.currency,
        currency,
      );
      const convertedBudgetExpense = convertCurrency(
        budget.total_exp, // Prisma.Decimal is handled by convertCurrency
        budget.currency,
        currency,
      );

      return {
        id: budget.id,
        year: year,
        budgetIncome: convertedBudgetIncome, // Budgeted income
        budgetExpense: convertedBudgetExpense, // Budgeted expense
        actualIncome: actualData.actualIncome, // Actual income from transactions
        actualExpense: actualData.actualExpense, // Actual expense from transactions,
      };
    });

    // Step 7: Include the next cursor in the response (if there are more records)
    const nextCursor =
      response.length === take
        ? response[response.length - 1].year // Use the last year as the next cursor
        : null;

    // Step 6: Sort by year (optional, if you want consistent ordering)
    response.sort((a, b) => a.year + b.year);

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
}

export const budgetUseCase = new BudgetUseCase(budgetRepository, budgetDetailRepository);
