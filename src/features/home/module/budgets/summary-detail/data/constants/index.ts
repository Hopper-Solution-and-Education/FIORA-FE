import { BudgetDetailType } from '../../presentation/types/table.type';

export const BUDGET_SUMMARY_TREE_INCRESEMENT_LENGTH_PER_LEVEL = 32;
export const BUDGET_SUMMARY_TREE_LINE_STOKE = 2;

export const HEIGHT_ROW = 3.4;

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

export const PERIOD_CONFIG = {
  months: Array.from({ length: 12 }, (_, i) => ({
    key: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][i],
    dataKey: `m${i + 1}`,
    title: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  })),
  quarters: Array.from({ length: 4 }, (_, i) => ({
    key: `q${i + 1}`,
    dataKey: `q${i + 1}`,
    title: `Q${i + 1}`,
  })),
  halfYears: Array.from({ length: 2 }, (_, i) => ({
    key: `h${i + 1}`,
    dataKey: `h${i + 1}`,
    title: `H${i + 1}`,
  })),
} as const;

export const BUDGETR_FILTER_KEY = {
  recordType: ['actual', 'Total Actual Sum Up', 'Actual sum-up', 'Actual sum up'],
  columnKey: [
    ...PERIOD_CONFIG.months.map(({ key }) => key),
    ...PERIOD_CONFIG.quarters.map(({ key }) => key),
    ...PERIOD_CONFIG.halfYears.map(({ key }) => key),
    'fullYear',
  ],
};

export const COMPARISON_TYPES = {
  KEY_TO_COMPARE: 'keyToCompare',
  REFERENCE_KEY: 'referenceKey',
};
