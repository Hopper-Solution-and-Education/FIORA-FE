import { BudgetDetails, Prisma } from '@prisma/client';

export interface IBudgetDetailRepository {
  createBudgetDetail(
    data: Prisma.BudgetDetailsUncheckedCreateInput,
    options?: Prisma.BudgetDetailsCreateArgs,
  ): Promise<BudgetDetails>;

  createManyBudgetDetails(
    data: Prisma.BudgetDetailsCreateManyInput | Prisma.BudgetDetailsCreateManyInput[],
    options?: Prisma.BudgetDetailsCreateManyArgs,
  ): Promise<BudgetDetails[]>;

  updateManyBudgetDetails(
    data: Prisma.BudgetDetailsUpdateManyMutationInput,
    where: Prisma.BudgetDetailsWhereInput,
    options?: Prisma.BudgetDetailsUpdateManyArgs,
  ): Promise<any>;

  findManyBudgetDetails(
    where: Prisma.BudgetDetailsWhereInput,
    options?: Prisma.BudgetDetailsFindManyArgs,
  ): Promise<BudgetDetails[]>;
}
