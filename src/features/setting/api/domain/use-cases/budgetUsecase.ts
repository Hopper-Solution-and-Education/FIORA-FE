import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { BudgetDetailType, BudgetsTable, Currency, TransactionType } from '@prisma/client';
import _ from 'lodash';
import { budgetDetailRepository } from '../../infrastructure/repositories/budgetDetailRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';
import { IBudgetDetailRepository } from '../../repositories/budgetDetailRepository';
import { BudgetCreation, IBudgetRepository } from '../../repositories/budgetRepository';

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
