import { HttpResponse } from '@/shared/types';

export type GetFinanceByDateRequestDTO = {
  from: string;
  to: string;
};

export type GetFinanceByDateResponseDTO = HttpResponse<
  {
    period: string;
    startDate: string;
    endDate: string;
    totalIncome: number;
    totalExpense: number;
  }[]
>;
