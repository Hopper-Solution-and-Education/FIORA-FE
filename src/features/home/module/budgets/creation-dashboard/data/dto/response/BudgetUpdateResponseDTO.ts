import { Currency, HttpResponse } from '@/shared/types';

export type BudgetUpdateResponseDTO = HttpResponse<BudgetUpdatedResponse>;

export type BudgetUpdatedResponse = {
  id: string;
  fiscalYear: number;
  type: 'Top' | 'Bot';
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  icon: string;
  currency: Currency;
};
