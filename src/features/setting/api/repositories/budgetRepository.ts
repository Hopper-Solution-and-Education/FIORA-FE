import { BudgetsTable, Currency, Prisma } from '@prisma/client';

export interface IBudgetRepository {
  createBudget(
    data: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableCreateArgs,
  ): Promise<BudgetsTable>;

  findBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindFirstArgs,
  ): Promise<BudgetsTable | null>;

  findManyBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindManyArgs,
  ): Promise<BudgetsTable[]>;

  upsertBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    update: Prisma.BudgetsTableUpdateInput,
    create: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableUpsertArgs,
  ): Promise<BudgetsTable>;

  updateBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    data: Prisma.BudgetsTableUpdateInput,
    options?: Prisma.BudgetsTableUpdateArgs,
  ): Promise<BudgetsTable>;

  deleteBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    options?: Prisma.BudgetsTableDeleteArgs,
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
  isSystemGenerated?: boolean;
}

export interface BudgetGetAnnualYearParams {
  userId: string;
  cursor?: number;
  take: number;
  currency: Currency;
  search?: string;
  filters?: any;
}

export type BudgetYearSummary = {
  year: number;
  budgetIncome: number;
  budgetExpense: number;
  actualIncome: number;
  actualExpense: number;
};
