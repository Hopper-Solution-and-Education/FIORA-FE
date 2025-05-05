import { prisma } from '@/config';
import { IBudgetRepository } from '../../repositories/budgetRepository';
import { BudgetsTable, Prisma } from '@prisma/client';

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

  async deleteBudget(
    where: Prisma.BudgetsTableWhereUniqueInput,
    options?: Prisma.BudgetsTableDeleteArgs,
  ): Promise<BudgetsTable> {
    return prisma.budgetsTable.delete({
      where,
      ...options,
    });
  }
}

// Export a single instance
export const budgetRepository = new BudgetRepository();
