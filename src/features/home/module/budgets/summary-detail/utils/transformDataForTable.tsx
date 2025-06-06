import { InputCurrency } from '@/components/common/forms';
import { ColumnProps } from '@/components/common/tables/custom-table/types';
import { Icons } from '@/components/Icon';
import { Currency } from '@/shared/types';
import { convertVNDToUSD } from '@/shared/utils';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';
import {
  BudgetDetailFilterType,
  BudgetDetailType,
  TableData,
} from '../presentation/types/table.type';
import CategorySelect from '../../../category/components/CategorySelect';
import { cn } from '@/shared/utils';
import { Category as BudgetCategory } from '../data/dto/response/CategoryResponseDTO';
import { COLORS } from '@/shared/constants/chart';
import { BudgetDetailFilterEnum, BUDGETR_FILTER_KEY, PERIOD_CONFIG } from '../data/constants';
import { formatters } from '@/shared/lib';

export const formatCurrencyValue = (
  value: number | string | undefined,
  currency: Currency,
): string => {
  if (value === undefined || value === '') return '0';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const formattedValue = currency === 'USD' ? convertVNDToUSD(numValue) : numValue;

  return formatters[currency].format(formattedValue);
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

export const getColumnsByPeriod = (
  period: string,
  periodId: string,
  currency: Currency,
  categories: BudgetCategory[] = [],
  onCategoryChange?: (categoryId: string) => void,
  onValidateClick?: (record: TableData) => void,
  onValueChange?: (record: TableData, columnKey: string, value: number) => void,
  onDeleteCategory?: (categoryId: string) => void,
  onRemoveCategory?: (categoryId: string) => void,
  activeTab?: BudgetDetailFilterType,
) => {
  const renderEditableCell = (text: any, record: TableData, index: number, column: ColumnProps) => {
    let color = '#000';

    if (
      activeTab &&
      BUDGETR_FILTER_KEY.recordType.includes(record.type) &&
      BUDGETR_FILTER_KEY.columnKey.includes(column.key)
    ) {
      if (activeTab === BudgetDetailFilterEnum.EXPENSE) color = COLORS.DEPS_DANGER.LEVEL_1;
      else color = COLORS.DEPS_SUCCESS.LEVEL_1;
    }

    if (record.isEditable) {
      return (
        <InputCurrency
          name={`value_${record.key}_${column.key}`}
          value={text || 0}
          currency={currency}
          classContainer="m-0"
          className="text-right"
          onChange={(newValue) => {
            if (onValueChange && record) {
              onValueChange(record, column.key, newValue);
            }
          }}
        />
      );
    }

    return <span style={{ color }}>{formatCurrencyValue(text, currency)}</span>;
  };

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
    className: 'uppercase',
    render: (text: any, record: TableData, index: number) =>
      renderEditableCell(text, record, index, { key, ...options }),
    ...options,
  });

  const defaultColumns = [
    createColumn('type', 'Type', {
      width: 200,
      align: 'right',
      fixed: 'right',
      render: (text: string, record: TableData) => {
        if (record.isParent) {
          return (
            <div className={cn('w-full h-full flex items-center gap-2')}>
              <CategorySelect
                className="w-full h-full m-0"
                name="category"
                categories={categories as any[]}
                side="right"
                onChange={(value) => onCategoryChange?.(value)}
                value={text ? categories.find((cat) => cat.name === text)?.id : undefined}
                placeholder="Select a category"
              />
            </div>
          );
        }
        return text;
      },
    }),
  ];

  const actionColumn = createColumn('action', 'ACTION', {
    fixed: 'right',
    align: 'center',
    width: 60,
    headerAlign: 'center',
    render: (_: number, record: TableData) => {
      const [categoryId] = record.key.split('-bottom-up');

      return record.isEditable ? (
        <div className="grid grid-flow-col place-items-center gap-2">
          <span
            className="text-red-500 hover:text-red-700 cursor-pointer"
            title="Invalid"
            onClick={() => {
              onRemoveCategory?.(categoryId);
              onDeleteCategory?.(categoryId);
            }}
          >
            <Icons.close size={15} />
          </span>
          <span
            className="text-green-500 hover:text-green-700 cursor-pointer"
            title="Valid"
            onClick={() => onValidateClick?.(record)}
          >
            <Icons.check size={15} />
          </span>
        </div>
      ) : null;
    },
  });

  const createPeriodColumns = (
    config: typeof PERIOD_CONFIG.months,
    additionalProps?: Partial<ColumnProps>,
  ) =>
    config.map(({ key, title }) =>
      createColumn(key, title.toUpperCase(), {
        dataIndex: key,
        headerAlign: 'center',
        align: 'right',
        render: (text: any, record: TableData, index: number) =>
          renderEditableCell(text, record, index, { key }),
        ...additionalProps,
      }),
    );

  const monthColumns = createPeriodColumns(PERIOD_CONFIG.months);
  const quarterColumns = createPeriodColumns(PERIOD_CONFIG.quarters, {
    bgColorClassName: 'bg-muted',
  });
  const halfYearColumns = createPeriodColumns(PERIOD_CONFIG.halfYears, {
    bgColorClassName: 'bg-muted',
  });
  const fullYearColumn = [
    createColumn('fullYear', 'FULL YEAR', {
      dataIndex: 'fullYear',
      align: 'right',
      render: (text: any, record: TableData, index: number) =>
        renderEditableCell(text, record, index, { key: 'fullYear' }),
      bgColorClassName: 'bg-muted',
    }),
  ];

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
    default: {
      // Create interleaved columns
      const interleaved: ColumnProps[] = [];

      // First 3 months + Q1
      interleaved.push(...monthColumns.slice(0, 3), quarterColumns[0]);

      // Next 3 months + Q2 + H1
      interleaved.push(...monthColumns.slice(3, 6), quarterColumns[1], halfYearColumns[0]);

      // Next 3 months + Q3
      interleaved.push(...monthColumns.slice(6, 9), quarterColumns[2]);

      // Last 3 months + Q4 + H2 + Full Year
      interleaved.push(
        ...monthColumns.slice(9, 12),
        quarterColumns[3],
        halfYearColumns[1],
        ...fullYearColumn,
      );

      periodColumns = interleaved;
    }
  }

  return [...defaultColumns, ...periodColumns, actionColumn];
};
