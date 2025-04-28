import { BudgetsTable } from '@prisma/client';
import { Budget } from './Budget';

export interface BudgetSummary {
  topBudget: BudgetsTable | null;
  botBudget: BudgetsTable | null;
  actBudget: BudgetsTable | null;
  allBudgets: BudgetsTable[];
}

export type BudgetSummaryByType = Budget;
