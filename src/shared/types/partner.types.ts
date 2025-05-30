import { Prisma } from '@prisma/client';

export type PartnerExtras = Prisma.PartnerGetPayload<{
  include: {
    transactions: true;
    children: true;
    parent: true;
  };
}>;

export interface PartnerRangeFilter {
  totalIncomeMin: number;
  totalIncomeMax: number;
  totalExpenseMin: number;
  totalExpenseMax: number;
}
