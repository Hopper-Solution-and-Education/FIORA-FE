import { Currency } from '@prisma/client';
import { BudgetGetDataResponse } from '../../domain/entities/Budget';

interface BudgetControlState {
  isLoadingGetBudget: boolean;
  isCreatingBudget: boolean;

  getBudget: {
    isLoading: boolean;
    nextCursor: number | null;
    budgets: BudgetGetDataResponse[];
    isLast: boolean;
    currency: Currency;
  };

  isDeletingBudget: boolean;

  isUpdatingBudget: boolean;
}

export const initialBudgetControlState: BudgetControlState = {
  isLoadingGetBudget: false,
  isCreatingBudget: false,

  getBudget: {
    isLoading: false,
    nextCursor: null,
    budgets: [],
    isLast: false,
    currency: Currency.VND,
  },

  isDeletingBudget: false,
  isUpdatingBudget: false,
};
