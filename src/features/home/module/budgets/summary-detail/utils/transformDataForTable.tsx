import { InputCurrency } from '@/components/common/forms';
import { ColumnProps } from '@/components/common/tables/custom-table/types';
import { Icons } from '@/components/Icon';
import { Currency } from '@/shared/types';
import { convertVNDToUSD } from '@/shared/utils';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';
import { BudgetDetailType, TableData } from '../presentation/types/table.type';

const PERIOD_CONFIG = {
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

export const formatCurrencyValue = (value: number, currency: Currency): string => {
  const formattedValue = currency === 'USD' ? convertVNDToUSD(value) : value;
  return formattedValue?.toLocaleString();
};

export const getBudgetValue = (
  budget: BudgetSummaryByType | null,
  field: string,
  type: 'expense' | 'income',
): number => {
  if (!budget?.budget) return 0;
  const suffix = type === 'expense' ? 'Exp' : 'Inc';
  const key = `${field}${suffix}` as keyof typeof budget.budget;
  const value = parseFloat(budget.budget[key] as string);
  return isNaN(value) ? 0 : value;
};

export const aggregateForPeriod = (
  budget: BudgetSummaryByType | null,
  type: 'expense' | 'income',
): { [key: string]: number } => {
  const data: { [key: string]: number } = {};

  // Aggregate months
  PERIOD_CONFIG.months.forEach(({ key, dataKey }) => {
    data[key] = getBudgetValue(budget, dataKey, type);
  });

  // Aggregate quarters
  PERIOD_CONFIG.quarters.forEach(({ key, dataKey }) => {
    data[key] = getBudgetValue(budget, dataKey, type);
  });

  // Aggregate half years
  PERIOD_CONFIG.halfYears.forEach(({ key, dataKey }) => {
    data[key] = getBudgetValue(budget, dataKey, type);
  });

  // Add full year
  data['fullYear'] = getBudgetValue(budget, 'total', type);

  return data;
};

export const getTableDataByPeriod = (
  top: BudgetSummaryByType | null,
  bot: BudgetSummaryByType | null,
  act: BudgetSummaryByType | null,
  type: 'expense' | 'income' = 'expense',
): TableData[] => {
  const createTableRow = (
    key: string,
    type: string,
    data: { [key: string]: number },
    isEditable: boolean,
  ): TableData => ({
    key,
    type,
    ...data,
    isEditable,
  });

  return [
    createTableRow('top-down', 'Total Top Down', aggregateForPeriod(top, type), true),
    createTableRow('bottom-up', 'Total Bottom Up', aggregateForPeriod(bot, type), false),
    createTableRow('actual', 'Total Actual Sum Up', aggregateForPeriod(act, type), false),
  ];
};

export const getColumnsByPeriod = (period: string, periodId: string, currency: Currency) => {
  const createColumn = (
    key: string,
    title: string,
    options?: Partial<ColumnProps>,
  ): ColumnProps => ({
    key,
    dataIndex: key,
    title,
    width: 120,
    align: 'center',
    ...options,
  });

  const renderEditableCell = (value: number, record: TableData) => {
    if (record.isEditable) {
      return <InputCurrency name="value" value={value} currency={currency} classContainer="m-0" />;
    }
    return formatCurrencyValue(value, currency);
  };

  const defaultColumns = [
    createColumn('type', 'Type', { width: 200, align: 'left', fixed: 'left' }),
  ];

  const actionColumn = createColumn('action', 'ACTION', {
    fixed: 'right',
    render: (_: number, record: TableData) =>
      record.isEditable ? (
        <div className="grid grid-flow-col place-items-center gap-2">
          <span className="text-red-500 hover:text-red-700 cursor-pointer" title="Invalid">
            <Icons.close size={15} />
          </span>
          <span className="text-green-500 hover:text-green-700 cursor-pointer" title="Valid">
            <Icons.check size={15} />
          </span>
        </div>
      ) : null,
  });

  const createPeriodColumns = (config: typeof PERIOD_CONFIG.months) =>
    config.map(({ key, title }) => createColumn(key, title, { render: renderEditableCell }));

  const monthColumns = createPeriodColumns(PERIOD_CONFIG.months);
  const quarterColumns = createPeriodColumns(PERIOD_CONFIG.quarters);
  const halfYearColumns = createPeriodColumns(PERIOD_CONFIG.halfYears);
  const fullYearColumn = [createColumn('fullYear', 'Full Year', { render: renderEditableCell })];

  let periodColumns: ColumnProps[] = [];

  switch (period) {
    case BudgetDetailType.MONTH: {
      const monthIndex = parseInt(periodId.split('-')[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        periodColumns = [monthColumns[monthIndex]];
      }
      break;
    }

    case BudgetDetailType.QUARTER: {
      const quarterIndex = parseInt(periodId.split('-')[1]) - 1;
      if (quarterIndex >= 0 && quarterIndex < 4) {
        const startMonthIndex = quarterIndex * 3;
        periodColumns = [
          ...monthColumns.slice(startMonthIndex, startMonthIndex + 3),
          quarterColumns[quarterIndex],
        ];
      }
      break;
    }

    case BudgetDetailType.HALF_YEAR: {
      const halfYearIndex = parseInt(periodId.split('-')[2]) - 1;
      if (halfYearIndex >= 0 && halfYearIndex < 2) {
        const startMonthIndex = halfYearIndex * 6;
        const startQuarterIndex = halfYearIndex * 2;
        periodColumns = [
          ...monthColumns.slice(startMonthIndex, startMonthIndex + 6),
          ...quarterColumns.slice(startQuarterIndex, startQuarterIndex + 2),
          halfYearColumns[halfYearIndex],
        ];
      }
      break;
    }

    case BudgetDetailType.YEAR:
    default:
      periodColumns = [...monthColumns, ...quarterColumns, ...halfYearColumns, ...fullYearColumn];
  }

  return [...defaultColumns, ...periodColumns, actionColumn];
};
