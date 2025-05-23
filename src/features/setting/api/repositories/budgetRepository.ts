import { FetchTransactionResponse } from '@/shared/types/budget.types';
import { BudgetsTable, Prisma } from '@prisma/client';

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
  findBudgetsByUserIdAndFiscalYear(userId: string, fiscalYear: string): Promise<BudgetsTable[]>;

  fetchTransactionsTx(
    userId: string,
    yearStart: Date,
    effectiveEndDate: Date,
    prisma: Prisma.TransactionClient,
  ): Promise<FetchTransactionResponse[] | []>;

  copyBudget(budget: Omit<BudgetsTable, 'id'>): Promise<BudgetsTable>;
}
