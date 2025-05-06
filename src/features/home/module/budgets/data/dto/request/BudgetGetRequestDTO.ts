import { Currency } from '@/shared/types';

export type BudgetGetRequestDTO = {
  cursor: number | null;
  take: number;
  search?: string;
  filters?: {
    fiscalYear: {
      gte: number;
      lte: number;
    };
  };
  currency?: Currency;
};
