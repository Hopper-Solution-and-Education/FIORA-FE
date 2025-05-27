import { BudgetDetailType } from '../../presentation/types/table.type';

export const BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL = 32;
export const BUDGET_SUMMARY_TREE_LINE_STOKE = 2;

export const PERIOD_OPTIONS = [
  { value: 'year', label: 'Full Year', period: BudgetDetailType.YEAR },
  ...Array.from({ length: 2 }, (_, i) => ({
    value: `half-year-${i + 1}`,
    label: `${i + 1}${i === 0 ? 'st' : 'nd'} Half-Year`,
    period: BudgetDetailType.HALF_YEAR,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    value: `quarter-${i + 1}`,
    label: `Quarter ${i + 1}`,
    period: BudgetDetailType.QUARTER,
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    value: `month-${i + 1}`,
    label: new Date(0, i).toLocaleString('en', { month: 'long' }),
    period: BudgetDetailType.MONTH,
  })),
] as const;

export enum BudgetDetailFilterEnum {
  EXPENSE = 'expense',
  INCOME = 'income',
}
