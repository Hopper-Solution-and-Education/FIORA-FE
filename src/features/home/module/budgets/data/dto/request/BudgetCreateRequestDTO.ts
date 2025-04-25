import { Currency } from '@prisma/client';

export type BudgetCreateRequestDTO = {
  icon: string;
  fiscalYear: number;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
};
