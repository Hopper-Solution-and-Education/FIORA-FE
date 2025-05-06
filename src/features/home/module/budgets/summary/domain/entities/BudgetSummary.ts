import { Budget } from './Budget';

export interface BudgetSummary {
  topBudget: Budget | null;
  botBudget: Budget | null;
  actBudget: Budget | null;
  allBudgets: Budget[];
}
