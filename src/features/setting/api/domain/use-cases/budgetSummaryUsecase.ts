import { BudgetsTable, BudgetType, Prisma } from '@prisma/client';
import { ITransactionRepository } from '../../../../transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '../../../../transaction/infrastructure/repositories/transactionRepository';
import { budgetRepository } from '../../infrastructure/repositories/budgetProductRepository';
import { IBudgetRepository } from '../../repositories/budgetRepository';

interface BudgetSummaryResponse {
  topBudget: BudgetsTable | null;
  botBudget: BudgetsTable | null;
  actBudget: BudgetsTable | null;
  allBudgets: BudgetsTable[];
}

class BudgetSummaryUsecase {
  constructor(
    private _budgetRepository: IBudgetRepository = budgetRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
  ) {}

  async getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponse> {
    const budgets = await this._budgetRepository.findBudgetsByUserIdAndFiscalYear(
      userId,
      fiscalYear,
    );

    const topBudget = budgets.find((budget) => budget.type === BudgetType.Top) || null;
    const botBudget = budgets.find((budget) => budget.type === BudgetType.Bot) || null;
    const actBudget = budgets.find((budget) => budget.type === BudgetType.Act) || null;

    return {
      topBudget,
      botBudget,
      actBudget,
      allBudgets: budgets,
    };
  }

  async getBudgetByType(
    userId: string,
    fiscalYear: number,
    type: BudgetType,
  ): Promise<BudgetsTable | null> {
    const budgets = await this._budgetRepository.findBudgetsByUserIdAndFiscalYear(
      userId,
      fiscalYear,
    );
    const budget = budgets.find((budget) => budget.type === type) || null;

    if (budget && type === BudgetType.Act) {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const startOfFiscalYear = new Date(`${fiscalYear}-01-01`);
      const endOfFiscalYear = new Date(`${fiscalYear}-12-31`);

      const startDate = oneMonthAgo < startOfFiscalYear ? startOfFiscalYear : oneMonthAgo;
      const endDate = now > endOfFiscalYear ? endOfFiscalYear : now;

      const transactions = await this._transactionRepository.findManyTransactions({
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        isDeleted: false,
      });

      let totalIncome = 0;
      let totalExpense = 0;

      const monthlyIncome: Record<number, number> = {};
      const monthlyExpense: Record<number, number> = {};

      for (let i = 1; i <= 12; i++) {
        monthlyIncome[i] = 0;
        monthlyExpense[i] = 0;
      }

      transactions.forEach((transaction) => {
        const month = transaction.date.getMonth() + 1;

        if (transaction.type === 'Income') {
          totalIncome += Number(transaction.amount);
          monthlyIncome[month] += Number(transaction.amount);
        } else if (transaction.type === 'Expense') {
          totalExpense += Number(transaction.amount);
          monthlyExpense[month] += Number(transaction.amount);
        }
      });

      budget.total_inc = new Prisma.Decimal(totalIncome);
      budget.total_exp = new Prisma.Decimal(totalExpense);

      for (let i = 1; i <= 12; i++) {
        const incField = `m${i}_inc`;
        const expField = `m${i}_exp`;

        (budget as any)[incField] = new Prisma.Decimal(monthlyIncome[i]);
        (budget as any)[expField] = new Prisma.Decimal(monthlyExpense[i]);
      }

      budget.q1_inc = new Prisma.Decimal(monthlyIncome[1] + monthlyIncome[2] + monthlyIncome[3]);
      budget.q1_exp = new Prisma.Decimal(monthlyExpense[1] + monthlyExpense[2] + monthlyExpense[3]);
      budget.q2_inc = new Prisma.Decimal(monthlyIncome[4] + monthlyIncome[5] + monthlyIncome[6]);
      budget.q2_exp = new Prisma.Decimal(monthlyExpense[4] + monthlyExpense[5] + monthlyExpense[6]);
      budget.q3_inc = new Prisma.Decimal(monthlyIncome[7] + monthlyIncome[8] + monthlyIncome[9]);
      budget.q3_exp = new Prisma.Decimal(monthlyExpense[7] + monthlyExpense[8] + monthlyExpense[9]);
      budget.q4_inc = new Prisma.Decimal(monthlyIncome[10] + monthlyIncome[11] + monthlyIncome[12]);
      budget.q4_exp = new Prisma.Decimal(
        monthlyExpense[10] + monthlyExpense[11] + monthlyExpense[12],
      );

      const q1Inc = Number(budget.q1_inc);
      const q2Inc = Number(budget.q2_inc);
      const q3Inc = Number(budget.q3_inc);
      const q4Inc = Number(budget.q4_inc);
      const q1Exp = Number(budget.q1_exp);
      const q2Exp = Number(budget.q2_exp);
      const q3Exp = Number(budget.q3_exp);
      const q4Exp = Number(budget.q4_exp);

      budget.h1_inc = new Prisma.Decimal(q1Inc + q2Inc);
      budget.h1_exp = new Prisma.Decimal(q1Exp + q2Exp);
      budget.h2_inc = new Prisma.Decimal(q3Inc + q4Inc);
      budget.h2_exp = new Prisma.Decimal(q3Exp + q4Exp);
    }

    return budget;
  }
}

export const budgetSummaryUsecase = new BudgetSummaryUsecase();
