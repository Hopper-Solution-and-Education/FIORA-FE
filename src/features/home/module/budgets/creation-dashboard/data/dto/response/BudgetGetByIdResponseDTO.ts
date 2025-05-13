import { Currency, HttpResponse } from '@/shared/types';

export type BudgetGetByIdResponseDTO = HttpResponse<{
  id: string;
  icon: string;
  fiscalYear: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
}>;
