import { BudgetDetailFilterEnum } from '../../data/constants';

export const BudgetDetailType = {
  MONTH: 'month',
  QUARTER: 'quarter',
  HALF_YEAR: 'half-year',
  YEAR: 'year',
} as const;

export type BudgetPeriodType = (typeof BudgetDetailType)[keyof typeof BudgetDetailType];

export interface BudgetPeriodId {
  month: `month-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;
  quarter: `quarter-${1 | 2 | 3 | 4}`;
  'half-year': `half-year-${1 | 2}`;
  year: 'year';
}

export type BudgetPeriodIdType = BudgetPeriodId[BudgetPeriodType];

export interface TableData {
  key: string;
  type: string;
  jan?: number;
  feb?: number;
  mar?: number;
  q1?: number;
  apr?: number;
  may?: number;
  jun?: number;
  q2?: number;
  h1?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  q3?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  q4?: number;
  h2?: number;
  fullYear?: number;
  action?: boolean;
  children?: TableData[];
  isParent?: boolean;
  isChild?: boolean;
  isEditable?: boolean;
}

export type BudgetDetailFilterType =
  (typeof BudgetDetailFilterEnum)[keyof typeof BudgetDetailFilterEnum];
