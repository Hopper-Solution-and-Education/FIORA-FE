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
