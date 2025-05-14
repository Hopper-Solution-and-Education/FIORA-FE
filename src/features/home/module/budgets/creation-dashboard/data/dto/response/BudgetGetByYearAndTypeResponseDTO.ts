import { Currency, HttpResponse } from '@/shared/types';

export type BudgetGetByYearAndTypeResponseDTO = HttpResponse<{
  id: string;
  icon: string;
  fiscalYear: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
}>;
