import { BudgetsTable, Currency, Prisma } from '@prisma/client';

export interface IBudgetRepository {
  createBudget(
    data: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableCreateArgs,
  ): Promise<BudgetsTable>;

  findBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindUniqueArgs,
  ): Promise<BudgetsTable | null>;

  findManyBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindManyArgs,
  ): Promise<BudgetsTable[]>;

  findBudgetsByUserIdAndFiscalYear(userId: string, fiscalYear: number): Promise<BudgetsTable[]>;
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
  search?: string;
}

export type BudgetYearSummary = {
  year: number;
  budgetIncome: number;
  budgetExpense: number;
  actualIncome: number;
  actualExpense: number;
};
