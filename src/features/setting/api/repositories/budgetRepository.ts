import { FetchTransactionResponse } from '@/shared/types/budget.types';
import { BudgetDetails, BudgetsTable, Prisma } from '@prisma/client';

export interface IBudgetRepository {
  createBudget(
    data: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableCreateArgs,
  ): Promise<BudgetsTable>;

  findBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindFirstArgs,
  ): Promise<BudgetsTable | null>;

  findUniqueBudgetData(
    where: Prisma.BudgetsTableWhereUniqueInput,
    options?: Prisma.BudgetsTableFindUniqueArgs,
  ): Promise<BudgetsTable | null>;

  findManyBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindManyArgs,
  ): Promise<BudgetsTable[]>;

  updateBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    data: Prisma.BudgetsTableUpdateInput,
    options?: Prisma.BudgetsTableUpdateArgs,
  ): Promise<BudgetsTable>;

  updateBudgetTx(
    where: Prisma.BudgetsTableWhereUniqueInput,
    data: Prisma.BudgetsTableUpdateInput,
    prismaTransaction?: Prisma.TransactionClient,
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

  upsertBudgetDetailsProduct(
    where: Prisma.BudgetDetailsWhereUniqueInput,
    update: Prisma.BudgetDetailsUpdateInput,
    create: Prisma.BudgetDetailsUncheckedCreateInput,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<BudgetDetails>;

  copyBudget(budget: Omit<BudgetsTable, 'id'>): Promise<BudgetsTable>;
}
