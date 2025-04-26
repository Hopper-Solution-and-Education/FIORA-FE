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
    options?: Prisma.BudgetsTableFindUniqueArgs,
  ): Promise<BudgetsTable | null> {
    return prisma.budgetsTable.findFirst({
      where,
      ...options,
    });
  }
}

// Export a single instance
export const budgetRepository = new BudgetRepository();
