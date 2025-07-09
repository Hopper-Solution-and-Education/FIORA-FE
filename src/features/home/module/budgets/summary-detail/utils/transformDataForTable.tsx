import { InputCurrency } from '@/components/common/forms';
import { ColumnProps, DataSourceItemProps } from '@/components/common/tables/custom-table/types';
import { Icons } from '@/components/Icon';
import { Currency } from '@/shared/types';
import { ComparisonProps } from '@/shared/types/chart.type';
import { cn } from '@/shared/utils';
import { validate as isUUID } from 'uuid';
import CategorySelect from '../../../category/components/CategorySelect';
import {
  BudgetDetailFilterEnum,
  BUDGETR_FILTER_KEY,
  COMPARISON_TYPES,
  PERIOD_CONFIG,
} from '../data/constants';
import { Category as BudgetCategory } from '../data/dto/response/CategoryResponseDTO';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';
import {
  BudgetDetailFilterType,
  BudgetDetailType,
  TableData,
} from '../presentation/types/table.type';
import { createGeneralComparisonMapper } from './compareDataForTable';
import { formatCurrencyValue } from './convertTableDataCurrency';

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
): { [key: string]: DataSourceItemProps } => {
  const data: { [key: string]: DataSourceItemProps } = {};

  // Aggregate months
  PERIOD_CONFIG.months.forEach(({ key, dataKey }) => {
    data[key] = {
      value: getBudgetValue(budget, dataKey, type),
    };
  });

  // Aggregate quarters
  PERIOD_CONFIG.quarters.forEach(({ key, dataKey }) => {
    data[key] = {
      value: getBudgetValue(budget, dataKey, type),
    };
  });

  // Aggregate half years
  PERIOD_CONFIG.halfYears.forEach(({ key, dataKey }) => {
    data[key] = {
      value: getBudgetValue(budget, dataKey, type),
    };
  });

  // Add full year
  data['fullYear'] = {
    value: getBudgetValue(budget, 'total', type),
  };

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
    data: { [key: string]: DataSourceItemProps },
    isEditable: boolean,
    currency?: Currency,
  ): TableData => ({
    key,
    type,
    ...data,
    isEditable,
    currency: currency as Currency,
  });

  const baseCurrency = top?.budget.currency;

  return [
    createTableRow(
      'top-down',
      'Total Top Down',
      aggregateForPeriod(top, type),
      true,
      top?.budget.currency ?? baseCurrency,
    ),
    createTableRow(
      'bottom-up',
      'Total Bottom Up',
      aggregateForPeriod(bot, type),
      false,
      bot?.budget.currency ?? baseCurrency,
    ),
    createTableRow(
      'actual',
      'Total Actual Sum Up',
      aggregateForPeriod(act, type),
      false,
      act?.budget.currency ?? baseCurrency,
    ),
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
  onDeleteCategory?: (categoryId: string, isTruncate?: boolean) => void,
  onRemoveCategory?: (categoryId: string) => void,
  onClearTopDown?: () => void,
  tableData: TableData[] = [],
  activeTab: BudgetDetailFilterType = BudgetDetailFilterEnum.EXPENSE,
) => {
  const renderEditableCell = (text: any, record: TableData, index: number, column: ColumnProps) => {
    const isDisableEdited = !PERIOD_CONFIG.months.some((item) => item.key === column.key);
    if (record.isEditable && !isDisableEdited) {
      return (
        <InputCurrency
          name={`value_${record.key}_${column.key}`}
          value={typeof text === 'object' ? text.value : (text ?? 0)}
          currency={currency}
          classContainer="m-0"
          className={cn('text-right', column.className)}
          onChange={(newValue) => {
            if (onValueChange) {
              onValueChange(record, column.key, newValue);
            }
          }}
        />
      );
    }

    return (
      <span className={cn(`${column.className}`, isDisableEdited && 'opacity-90')}>
        {formatCurrencyValue(text?.value, currency)}
      </span>
    );
  };

  const generateKeyForCompare = (type: string, item: TableData): string | undefined => {
    if (!item?.children?.length) return undefined;

    if (type === COMPARISON_TYPES.KEY_TO_COMPARE) return item.children[1].key;
    if (type === COMPARISON_TYPES.REFERENCE_KEY) return item.children[0].key;

    return undefined;
  };

  const comparisonConfig: ComparisonProps[] = [
    {
      // Compare between Total Actual Sum-Up and Total Bottom-Up
      keyToCompare: 'actual',
      referenceKey: 'bottom-up',
      columns: BUDGETR_FILTER_KEY.columnKey,
      styleWhenGreater: 'text-red-500',
      styleWhenLessOrEqual: 'text-blue-500',
      comparisonType:
        activeTab === BudgetDetailFilterEnum.EXPENSE ? 'greaterOrEqual' : 'lessOrEqual',
    },
    ...tableData // Compare between Finance Category Items
      .slice()
      .filter((item: TableData) => item.isParent)
      .map((item: TableData) => {
        const keyToCompare = generateKeyForCompare(COMPARISON_TYPES.KEY_TO_COMPARE, item);
        const referenceKey = generateKeyForCompare(COMPARISON_TYPES.REFERENCE_KEY, item);

        if (!keyToCompare || !referenceKey) return null;

        return {
          keyToCompare,
          referenceKey,
          columns: BUDGETR_FILTER_KEY.columnKey,
          styleWhenGreater: 'text-red-500',
          styleWhenLessOrEqual: 'text-blue-500',
          comparisonType:
            activeTab === BudgetDetailFilterEnum.EXPENSE ? 'greaterOrEqual' : 'lessOrEqual',
        } as ComparisonProps;
      })
      .filter((item): item is ComparisonProps => item !== null),
  ];

  const generalComparisonMapper = createGeneralComparisonMapper(tableData, comparisonConfig);

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
      fixed: 'left',
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

  const actionColumn: ColumnProps = createColumn('action', 'ACTION', {
    fixed: 'right',
    align: 'center',
    width: 60,
    headerAlign: 'center',
    render: (_, record: TableData) => {
      const [categoryId] = record.key.split('-bottom-up');
      const isCategoryTitleRow = isUUID(record.key);

      if (isCategoryTitleRow) {
        return (
          <div className="grid grid-flow-col place-items-center gap-2">
            <span
              className={cn('text-red-500 hover:text-red-700 cursor-pointer')}
              title="Delete"
              onClick={() => {
                onRemoveCategory?.(categoryId);
                onDeleteCategory?.(categoryId, false);
              }}
            >
              <Icons.trash size={15} />
            </span>
          </div>
        );
      }

      if (record.isEditable) {
        return (
          <div className="grid grid-flow-col place-items-center gap-2">
            <span
              className={cn('cursor-pointer', 'text-red-500 hover:text-red-700')}
              title="Invalid"
              onClick={() => {
                if (record.key === 'top-down') {
                  onClearTopDown?.();
                } else if (categoryId) {
                  onDeleteCategory?.(categoryId);
                }
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
        );
      }

      return null;
    },
  });

  const createPeriodColumns = (
    config: typeof PERIOD_CONFIG.months,
    additionalCellProps?: Partial<ColumnProps>,
    additionalProps?: Partial<ColumnProps>,
  ) =>
    config.map(({ key, title }) =>
      createColumn(key, title.toUpperCase(), {
        dataIndex: key,
        headerAlign: 'center',
        align: 'right',
        ...additionalCellProps,
        render: (text: any, record: TableData, index: number) => {
          const mappedClass = generalComparisonMapper?.(record.key, key, text?.value ?? 0) ?? null;

          return renderEditableCell(text, record, index, {
            key,
            className: mappedClass,
            ...additionalProps,
          });
        },
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
