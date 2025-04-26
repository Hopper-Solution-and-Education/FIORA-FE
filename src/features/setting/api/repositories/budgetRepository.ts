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
