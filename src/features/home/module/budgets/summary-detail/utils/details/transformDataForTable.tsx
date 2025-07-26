import { InputCurrency } from '@/components/common/forms';
import {
  ColumnProps,
  DataSourceItemProps,
  FIXED,
} from '@/components/common/tables/custom-table/types';
import { Category } from '@/features/home/module/budgets/summary-detail/data/dto/response/CategoryResponseDTO';
import { Currency } from '@/shared/types';
import { ComparisonProps } from '@/shared/types/chart.type';
import { cn, formatCurrency } from '@/shared/utils';
import CategorySelect from '../../../../category/components/CategorySelect';
import {
  BudgetDetailFilterEnum,
  BUDGETR_FILTER_KEY,
  COMPARISON_TYPES,
  PERIOD_CONFIG,
} from '../../data/constants';
import { Category as BudgetCategory } from '../../data/dto/response/CategoryResponseDTO';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import {
  BudgetDetailType,
  GetColumnsByPeriodParams,
  MONTHS,
  TableData,
} from '../../presentation/types/table.type';
import { createGeneralComparisonMapper } from './compareDataForTable';

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
    fixed?: FIXED.TOP | FIXED.BOTTOM | FIXED.LEFT | FIXED.RIGHT,
  ): TableData => ({
    key,
    type,
    ...data,
    isEditable,
    currency: currency as Currency,
    fixed,
  });

  const baseCurrency = top?.budget.currency;

  return [
    createTableRow(
      'top-down',
      'Total Top Down',
      aggregateForPeriod(top, type),
      true,
      top?.budget.currency ?? baseCurrency,
      FIXED.TOP,
    ),
    createTableRow(
      'bottom-up',
      'Total Bottom Up',
      aggregateForPeriod(bot, type),
      false,
      bot?.budget.currency ?? baseCurrency,
      FIXED.TOP,
    ),
    createTableRow(
      'actual',
      'Total Actual Sum Up',
      aggregateForPeriod(act, type),
      false,
      act?.budget.currency ?? baseCurrency,
      FIXED.TOP,
    ),
  ];
};

// Helper: Return array of key and value of object
export const mapKeyValuePairs = (obj: Record<string, any>, type: 'record' | 'category'): any[] => {
  if (!obj) return [];
  switch (type) {
    case 'record':
      return MONTHS.map((month, idx) => {
        let value = obj[month];
        if (value && typeof value === 'object' && 'value' in value) {
          value = value.value;
        }
        return { key: `m${idx + 1}`, value };
      });
    case 'category':
      return Object.entries(obj)
        .filter(([key]) => /^m\d+(_inc|_exp)?$/.test(key))
        .map(([key, value]) => {
          const match = key.match(/^(m\d+)/);
          return match ? { key: match[1], value } : null;
        })
        .filter(Boolean) as { key: string; value: any }[];
  }
};

// Helper: Check enable validate
export const checkEnableValidate = (
  record: TableData,
  categories: BudgetCategory[],
  originTableData: TableData[],
  originCategoriesData: Category[],
) => {
  let compareA: any[] = [];
  let compareB: any[] = [];

  if (record.key === 'top-down') {
    compareB = mapKeyValuePairs(originTableData[0] || {}, 'record');
  }
  if (categories.some((cat) => cat.id === record.key.split('-bottom-up')[0])) {
    const findCategory = originCategoriesData.find(
      (cat) => cat.id === record.key.split('-bottom-up')[0],
    );
    const findCategoryBottomUpPlan = findCategory?.bottomUpPlan;
    compareB = mapKeyValuePairs(findCategoryBottomUpPlan || {}, 'category');
    if (findCategory?.isCreated === false) {
      return true;
    }
  }
  compareA = mapKeyValuePairs(record, 'record');
  return !compareA.every((item) =>
    compareB.some((b) => b.key === item.key && b.value === item.value),
  );
};

export const getColumnsByPeriod = ({
  period,
  periodId,
  currency,
  categories = [],
  onValueChange,
  tableData = [],
  activeTab = BudgetDetailFilterEnum.EXPENSE,
  isFullCurrencyDisplay,
}: GetColumnsByPeriodParams): ColumnProps[] => {
  const renderEditableCell = (text: any, record: TableData, index: number, column: ColumnProps) => {
    const isDisableEdited = !PERIOD_CONFIG.months.some((item) => item.key === column.key);
    if (text?.render) {
      return text.render;
    }
    if (record.isEditable && !isDisableEdited) {
      return (
        <InputCurrency
          name={`value_${record.key}_${column.key}`}
          value={typeof text === 'object' ? text.value : (text ?? 0)}
          currency={currency}
          isFullCurrencyDisplay={isFullCurrencyDisplay}
          classContainer="m-0"
          className={cn(
            'text-right h-[3.4rem] border-none rounded-none bg-white dark:bg-gray-900 hover:shadow-md hover:shadow-blue-500/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40',
            column.className,
          )}
          onChange={(newValue) => {
            if (onValueChange) {
              onValueChange(record, column.key, newValue);
            }
          }}
        />
      );
    }
    return (
      <p className={cn(`px-3 py-2 cursor-default ${column.className}`, isDisableEdited)}>
        {formatCurrency(text?.value, currency, isFullCurrencyDisplay)}
      </p>
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
      comparisonType: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'greater' : 'less',
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
          comparisonType: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'greater' : 'less',
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
      align: 'right',
      width: 200,
      render: (text: string, record: TableData) => {
        if (record.isParent) {
          return (
            <div className={cn('w-full h-full flex items-center gap-2')}>
              <CategorySelect
                className="w-full h-full m-0"
                name="category"
                categories={categories as any[]}
                side="right"
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
        className: 'p-0',
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

  const monthColumns = createPeriodColumns(PERIOD_CONFIG.months, {
    bgColorClassName: 'bg-blue-50 dark:bg-blue-900',
  });

  const quarterColumns = createPeriodColumns(PERIOD_CONFIG.quarters, {
    bgColorClassName: 'bg-green-50 dark:bg-green-900',
  });

  const halfYearColumns = createPeriodColumns(PERIOD_CONFIG.halfYears, {
    bgColorClassName: 'bg-yellow-50 dark:bg-yellow-900',
  });

  const fullYearColumn = [
    createColumn('fullYear', 'FULL YEAR', {
      dataIndex: 'fullYear',
      align: 'right',
      render: (text: any, record: TableData, index: number) =>
        renderEditableCell(text, record, index, { key: 'fullYear' }),
      bgColorClassName: 'bg-purple-50 dark:bg-purple-900',
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

  return [...defaultColumns, ...periodColumns];
};
