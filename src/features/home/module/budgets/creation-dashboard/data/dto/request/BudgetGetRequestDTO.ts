import { Currency } from '@/shared/types';

export type BudgetGetRequestDTO = {
  cursor: string | null;
  take: number;
  search?: string;
  filters?: {
    fiscalYear: {
      gte: string | null;
      lte: string | null;
    };
  };
  currency?: Currency;
};
