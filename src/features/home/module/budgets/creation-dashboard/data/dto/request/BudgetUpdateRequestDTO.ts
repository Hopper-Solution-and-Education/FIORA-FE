import { Currency } from '@/shared/types';

export type BudgetUpdateRequestDTO = {
  budgetYear: string;
  icon: string;
  fiscalYear: number;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
  type: 'Top' | 'Bottom';
};
