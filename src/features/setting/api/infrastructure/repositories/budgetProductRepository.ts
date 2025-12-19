import { prisma } from '@/config';
import { FetchTransactionResponse } from '@/shared/types';
import { BudgetDetails, BudgetsTable, Prisma, TransactionType } from '@prisma/client';
import { IBudgetRepository } from '../../repositories/budgetRepository.interface';

class BudgetRepository implements IBudgetRepository {
  async createBudget(
    data: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableCreateArgs,
  ): Promise<BudgetsTable> {
    return prisma.budgetsTable.create({
      data,
      ...options,
    });
  }

  async findBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindFirstArgs,
  ): Promise<BudgetsTable | null> {
    return prisma.budgetsTable.findFirst({
      where,
      ...options,
    });
  }

  async findManyBudgetData(
    where: Prisma.BudgetsTableWhereInput,
    options?: Prisma.BudgetsTableFindManyArgs,
  ): Promise<BudgetsTable[]> {
    return prisma.budgetsTable.findMany({
      where,
      ...options,
    });
  }

  async upsertBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    update: Prisma.BudgetsTableUpdateInput,
    create: Prisma.BudgetsTableUncheckedCreateInput,
    options?: Prisma.BudgetsTableUpsertArgs,
  ): Promise<BudgetsTable> {
    return prisma.budgetsTable.upsert({
      where,
      update,
      create,
      ...options,
    });
  }

  async updateBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    data: Prisma.BudgetsTableUpdateInput,
    options?: Prisma.BudgetsTableUpdateArgs,
  ): Promise<BudgetsTable> {
    return prisma.budgetsTable.update({
      where,
      data,
      ...options,
    });
  }

  async updateBudgetTx(
    where: Prisma.BudgetsTableWhereUniqueInput,
    data: Prisma.BudgetsTableUpdateInput,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<BudgetsTable> {
    const prismaTx = prismaTransaction || prisma;

    return await prismaTx.budgetsTable.update({
      where,
      data,
    });
  }

  async deleteBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    options?: Prisma.BudgetsTableDeleteArgs,
  ): Promise<BudgetsTable> {
    return prisma.budgetsTable.delete({
      where,
      ...options,
    });
  }

  async findBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: string,
  ): Promise<BudgetsTable[]> {
    return prisma.budgetsTable.findMany({
      where: {
        userId,
        fiscalYear,
      },
      orderBy: {
        type: 'asc',
      },
    });
  }

  async fetchTransactionsTx(
    userId: string,
    yearStart: Date,
    effectiveEndDate: Date,
    prisma: Prisma.TransactionClient,
  ): Promise<FetchTransactionResponse[] | []> {
    return await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: yearStart, lte: effectiveEndDate },
        isMarked: false,
        isDeleted: false,
        type: { in: [TransactionType.Expense, TransactionType.Income] },
      },
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
        date: true,
      },
    });
  }

  async copyBudget(budget: Omit<BudgetsTable, 'id'>): Promise<BudgetsTable> {
    const { ...budgetData } = budget;
    return prisma.budgetsTable.create({
      data: {
        ...budgetData,
      },
    });
  }

  async upsertBudgetDetailsProduct(
    where: Prisma.BudgetDetailsWhereUniqueInput,
    update: Prisma.BudgetDetailsUpdateInput,
    create: Prisma.BudgetDetailsUncheckedCreateInput,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<BudgetDetails> {
    const prismaTx = prismaTransaction || prisma;

    return await prismaTx.budgetDetails.upsert({
      where,
      update,
      create,
    });
  }

  async findUniqueBudgetData(
    where: Prisma.BudgetsTableWhereUniqueInput,
    options?: Prisma.BudgetsTableFindUniqueArgs,
  ): Promise<BudgetsTable | null> {
    return prisma.budgetsTable.findUnique({
      where,
      ...options,
    });
  }
}

// Export a single instance
export const budgetRepository = new BudgetRepository();
