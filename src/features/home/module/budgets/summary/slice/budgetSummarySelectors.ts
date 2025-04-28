import { RootState } from '@/store';

export const selectBudgetSummaryState = (state: RootState) => state.budgetSummary;
export const selectTopBudget = (state: RootState) => state.budgetSummary.topBudget;
export const selectBotBudget = (state: RootState) => state.budgetSummary.botBudget;
export const selectActBudget = (state: RootState) => state.budgetSummary.actBudget;
export const selectAllBudgets = (state: RootState) => state.budgetSummary.allBudgets;
export const selectBudgetSummaryLoading = (state: RootState) => state.budgetSummary.loading;
export const selectBudgetSummaryError = (state: RootState) => state.budgetSummary.error;

export const selectBudgetByType = (state: RootState, type: string) => {
  const { allBudgets } = state.budgetSummary;
  return allBudgets.find((budget: any) => budget.type === type) || null;
};

export const selectTotalIncome = (state: RootState) => {
  const { topBudget } = state.budgetSummary;
  return topBudget?.total_inc || 0;
};

export const selectTotalExpense = (state: RootState) => {
  const { topBudget } = state.budgetSummary;
  return topBudget?.total_exp || 0;
};

export const selectBalance = (state: RootState) => {
  const income = Number(selectTotalIncome(state));
  const expense = Number(selectTotalExpense(state));
  return income - expense;
};
