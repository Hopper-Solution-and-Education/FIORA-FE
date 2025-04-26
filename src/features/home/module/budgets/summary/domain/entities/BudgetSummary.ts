import { Budgets } from './Budget';

export interface BudgetSummary {
  topBudget: Budgets | null;
  botBudget: Budgets | null;
  actBudget: Budgets | null;
  allBudgets: Budgets[];
}

export type BudgetSummaryByType = Budgets;
