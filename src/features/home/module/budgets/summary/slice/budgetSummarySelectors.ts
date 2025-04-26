import { RootState } from '@/store';

// Selectors cơ bản
export const selectBudgetSummaryState = (state: RootState) => state.budgetSummary;
export const selectTopBudget = (state: RootState) => state.budgetSummary.topBudget;
export const selectBotBudget = (state: RootState) => state.budgetSummary.botBudget;
export const selectActBudget = (state: RootState) => state.budgetSummary.actBudget;
export const selectAllBudgets = (state: RootState) => state.budgetSummary.allBudgets;
export const selectBudgetSummaryLoading = (state: RootState) => state.budgetSummary.loading;
export const selectBudgetSummaryError = (state: RootState) => state.budgetSummary.error;

// Selector phức tạp hơn
export const selectBudgetByType = (state: RootState, type: string) => {
  const { allBudgets } = state.budgetSummary;
  return allBudgets.find((budget) => budget.type === type) || null;
};

// Selector để tính toán tổng thu nhập và chi tiêu
export const selectTotalIncome = (state: RootState) => {
  const { topBudget } = state.budgetSummary;
  return topBudget?.totalInc || 0;
};

export const selectTotalExpense = (state: RootState) => {
  const { topBudget } = state.budgetSummary;
  return topBudget?.totalExp || 0;
};

// Selector để tính toán số dư
export const selectBalance = (state: RootState) => {
  const income = selectTotalIncome(state);
  const expense = selectTotalExpense(state);
  return income - expense;
};
