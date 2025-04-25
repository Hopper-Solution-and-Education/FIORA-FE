interface BudgetControlState {
  isLoadingGetBudget: boolean;
  isCreatingBudget: boolean;
}

export const initialBudgetControlState: BudgetControlState = {
  isLoadingGetBudget: false,
  isCreatingBudget: false,
};
