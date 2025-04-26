import { BudgetGetDataResponse } from '../../domain/entities/Budget';

interface BudgetControlState {
  isLoadingGetBudget: boolean;
  isCreatingBudget: boolean;

  getBudget: {
    isLoading: boolean;
    nextCursor: number | null;
    budgets: BudgetGetDataResponse[];
    isLast: boolean;
  };
}

export const initialBudgetControlState: BudgetControlState = {
  isLoadingGetBudget: false,
  isCreatingBudget: false,
  getBudget: {
    isLoading: false,
    nextCursor: null,
    budgets: [],
    isLast: false,
  },
};
