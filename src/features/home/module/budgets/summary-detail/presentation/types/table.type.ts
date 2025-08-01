import {
  DataSourceItemProps,
  DataSourceProps,
} from '@/components/common/tables/custom-table/types';
import { Currency } from '@/shared/types';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { Category as BudgetCategory } from '../../data/dto/response/CategoryResponseDTO';

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
  isFullCurrencyDisplay?: boolean;
  originalData?: TableRowData;
  hasChanges?: boolean;
}

export interface TableRowData {
  [key: string]: DataSourceItemProps;
}

export type TableRowDataWithOriginal = TableRowData & {
  originalData: TableRowData;
  hasChanges: boolean;
};

// Type definition for month abbreviations to improve type safety and debugging
export type MonthAbbreviation =
  | 'jan'
  | 'feb'
  | 'mar'
  | 'apr'
  | 'may'
  | 'jun'
  | 'jul'
  | 'aug'
  | 'sep'
  | 'oct'
  | 'nov'
  | 'dec';

// Type for the MONTHS array to ensure type safety when accessing by index
export type MonthsArray = readonly MonthAbbreviation[];

export const MONTHS: MonthsArray = [
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

// Type for getColumnsByPeriod function parameters to improve maintainability
export interface GetColumnsByPeriodParams {
  period: BudgetPeriodType;
  periodId: BudgetPeriodIdType;
  currency: Currency;
  categories?: BudgetCategory[];
  onValueChange?: (record: TableData, columnKey: string, value: number) => void;
  tableData?: TableData[];
  activeTab?: BudgetDetailFilterType;
  isFullCurrencyDisplay?: boolean;
  formatCurrency: (
    value: number,
    currency: Currency,
    options?: { shouldShortened?: boolean },
  ) => string;
}
