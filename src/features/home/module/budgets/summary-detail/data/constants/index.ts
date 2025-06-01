import { BudgetDetailType } from '../../presentation/types/table.type';

export const BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL = 32;
export const BUDGET_SUMMARY_TREE_LINE_STOKE = 2;

export const PERIOD_OPTIONS = [
  // Months 1-3 + Q1
  ...Array.from({ length: 3 }, (_, i) => ({
    value: `month-${i + 1}`,
    label: new Date(0, i).toLocaleString('en', { month: 'long' }),
    period: BudgetDetailType.MONTH,
  })),
  { value: 'quarter-1', label: 'Quarter 1', period: BudgetDetailType.QUARTER },

  // Months 4-6 + Q2 + H1
  ...Array.from({ length: 3 }, (_, i) => ({
    value: `month-${i + 4}`,
    label: new Date(0, i + 3).toLocaleString('en', { month: 'long' }),
    period: BudgetDetailType.MONTH,
  })),
  { value: 'quarter-2', label: 'Quarter 2', period: BudgetDetailType.QUARTER },
  { value: 'half-year-1', label: '1st Half-Year', period: BudgetDetailType.HALF_YEAR },

  // Months 7-9 + Q3
  ...Array.from({ length: 3 }, (_, i) => ({
    value: `month-${i + 7}`,
    label: new Date(0, i + 6).toLocaleString('en', { month: 'long' }),
    period: BudgetDetailType.MONTH,
  })),
  { value: 'quarter-3', label: 'Quarter 3', period: BudgetDetailType.QUARTER },

  // Months 10-12 + Q4 + H2 + Year
  ...Array.from({ length: 3 }, (_, i) => ({
    value: `month-${i + 10}`,
    label: new Date(0, i + 9).toLocaleString('en', { month: 'long' }),
    period: BudgetDetailType.MONTH,
  })),
  { value: 'quarter-4', label: 'Quarter 4', period: BudgetDetailType.QUARTER },
  { value: 'half-year-2', label: '2nd Half-Year', period: BudgetDetailType.HALF_YEAR },
  { value: 'year', label: 'Full Year', period: BudgetDetailType.YEAR },
] as const;

export enum BudgetDetailFilterEnum {
  EXPENSE = 'expense',
  INCOME = 'income',
}
