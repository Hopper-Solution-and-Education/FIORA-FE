import { Category, Prisma } from '@prisma/client';

export interface CategoryWithTransactions extends Category {
  fromTransactions: { amount: number }[];
  toTransactions: { amount: number }[];
  subCategories: CategoryWithTransactions[];
}

export type CategoryExtras = Prisma.CategoryGetPayload<{
  include: {
    fromTransactions: true;
    toTransactions: true;
    subCategories: true;
  };
}>;

export type CategoryWithBudgetDetails = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    icon: true;
    type: true;
    budgetDetails: {
      select: {
        month: true;
        amount: true;
        currency: true;
      };
    };
  };
}>;
