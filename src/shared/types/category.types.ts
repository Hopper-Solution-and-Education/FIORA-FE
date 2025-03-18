import { Category } from '@prisma/client';

export interface CategoryWithTransactions extends Category {
  fromTransactions: { amount: number }[];
  toTransactions: { amount: number }[];
  subCategories: CategoryWithTransactions[];
}
