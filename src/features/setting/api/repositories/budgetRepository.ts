import { BudgetsTable, Currency, Prisma } from '@prisma/client';

export interface IBudgetRepository {
  createBudget(
    data: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableCreateArgs,
  ): Promise<BudgetsTable>;
}

export interface BudgetCreation {
  fiscalYear: number;
  icon?: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description?: string;
  userId: string;
  currency: Currency;
}

export interface BudgetGetAnnualYearParams {
  userId: string;
  cursor?: number;
  take: number;
  currency: Currency;
}

export type BudgetYearSummary = {
  year: number;
  budgetIncome: number;
  budgetExpense: number;
  actualIncome: number;
  actualExpense: number;
};
