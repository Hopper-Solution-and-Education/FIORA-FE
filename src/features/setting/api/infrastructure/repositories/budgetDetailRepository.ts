import { prisma } from '@/config';
import { BudgetDetails, Prisma } from '@prisma/client';
import { IBudgetDetailRepository } from '../../repositories/budgetDetailRepository';

class BudgetDetailRepository implements IBudgetDetailRepository {
  async createBudgetDetail(
    data: Prisma.BudgetDetailsUncheckedCreateInput,
    options?: Prisma.BudgetDetailsCreateArgs,
  ): Promise<BudgetDetails> {
    return prisma.budgetDetails.create({
      data,
      ...options,
    });
  }

  async createManyBudgetDetails(
    data: Prisma.BudgetDetailsCreateManyInput | Prisma.BudgetDetailsCreateManyInput[],
    options?: Prisma.BudgetDetailsCreateManyArgs,
  ): Promise<any[]> {
    return prisma.budgetDetails.createManyAndReturn({
      data,
      ...options,
    });
  }

  async updateManyBudgetDetails(
    data: Prisma.BudgetDetailsUpdateManyMutationInput,
    where: Prisma.BudgetDetailsWhereInput,
    options?: Prisma.BudgetDetailsUpdateManyArgs,
  ): Promise<any> {
    return prisma.budgetDetails.updateMany({
      data,
      where,
      ...options,
    });
  }
}

// Export a single instance
export const budgetDetailRepository = new BudgetDetailRepository();
