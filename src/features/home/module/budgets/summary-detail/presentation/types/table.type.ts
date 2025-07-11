import { DataSourceProps } from '@/components/common/tables/custom-table/types';
import { BudgetDetailFilterEnum } from '../../data/constants';

export type BudgetDetailFilterType =
  (typeof BudgetDetailFilterEnum)[keyof typeof BudgetDetailFilterEnum];

export enum BudgetDetailType {
  MONTH = 'month',
  QUARTER = 'quarter',
  HALF_YEAR = 'half-year',
  YEAR = 'year',
}

export type BudgetPeriodType = 'month' | 'quarter' | 'half-year' | 'year';

export interface BudgetPeriodId {
  month: `month-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`;
  quarter: `quarter-${1 | 2 | 3 | 4}`;
  'half-year': `half-year-${1 | 2}`;
  year: 'year';
}

export type BudgetPeriodIdType = string;

export interface TableData extends DataSourceProps {
  type: string;
  action?: boolean;
  isEditable?: boolean;
  isNew?: boolean;
  children?: TableData[];
  categoryId?: string;
}

export const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

export interface BudgetInit<T> {
  data: T[];
  set: React.Dispatch<React.SetStateAction<T[]>>;
  fetch: () => Promise<void>;
}
