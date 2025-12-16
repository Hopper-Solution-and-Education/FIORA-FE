import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { useCurrencyFormatter } from '@/shared/hooks';
import { FilterColumn, FilterComponentConfig, FilterCriteria } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { updateAmountRange } from '../../slices';
import { DEFAULT_SAVING_FILTER_CRITERIA } from '../../utils/constants';

// Define constants for magic numbers
const DEFAULT_MAX_AMOUNT = 10000;

// Define types for filter structures
interface DateCondition {
  gte?: string;
  lte?: string;
}

interface AmountCondition {
  gte?: number;
  lte?: number;
}

interface BaseAmountCondition {
  gte?: number;
  lte?: number;
}

interface TypeCondition {
  type?: string;
}

interface FilterAndCondition {
  type?: string;
  amount?: AmountCondition;
  baseAmount?: BaseAmountCondition;
  baseCurrency?: string;
  date?: string | DateCondition;
  OR?: TypeCondition[];
  AND?: FilterAndCondition[];
}

interface FilterStructure {
  AND?: FilterAndCondition[];
  date?: string | DateCondition;
  amount?: AmountCondition;
  baseAmount?: BaseAmountCondition;
  baseCurrency?: string;
}

type FilterParams = {
  dateRange?: DateRange;
  types: string[];
  amountMin: number;
  amountMax: number;
};

const filterParamsInitState: FilterParams = {
  dateRange: undefined,
  types: [],
  amountMin: 0,
  amountMax: DEFAULT_MAX_AMOUNT,
};

type FilterMenuProps<T> = {
  callBack: (newFilter: FilterCriteria) => void;
  components?: FilterComponentConfig[];
  filterParams?: T;
};

const options = [
  { value: 'Expense', label: 'Expense' },
  { value: 'Income', label: 'Income' },
  { value: 'Transfer', label: 'Transfer' },
];

const SavingFilterMenu = <T extends Record<string, unknown>>(props: FilterMenuProps<T>) => {
  const { callBack, components } = props;
  const { amountMin, amountMax, filterCriteria } = useAppSelector((state) => state.savingWallet);
  const { currency: selectedCurrency, currency } = useAppSelector((state) => state.settings);
  const { getExchangeAmount } = useCurrencyFormatter();
  const dispatch = useAppDispatch();

  // State for managing filter parameters
  const [filterParams, setFilterParams] = useState<FilterParams>({
    ...filterParamsInitState,
    amountMin: amountMin || 0,
    amountMax: amountMax || DEFAULT_MAX_AMOUNT,
  });

  // Extract filter data from complex filter structure
  const extractFilterData = useCallback(
    (filters: FilterStructure) => {
      const types: Set<string> = new Set();
      let currentAmountMin = amountMin;
      let currentAmountMax = amountMax;
      let dateFrom: Date | undefined;
      let dateTo: Date | undefined;

      // Handle date range at the top level regardless of structure
      if (filters?.date) {
        if (typeof filters.date === 'string') {
          // Handle case where date is a direct string value (single date)
          const dateValue = new Date(filters.date);
          dateFrom = dateValue;
          dateTo = dateValue;
        } else {
          // Handle standard date range object with gte/lte
          dateFrom = filters.date.gte ? new Date(filters.date.gte) : undefined;
          dateTo = filters.date.lte ? new Date(filters.date.lte) : undefined;
        }
      }

      // Handle AND array structure
      if (Array.isArray(filters?.AND)) {
        filters.AND.forEach((condition: FilterAndCondition) => {
          // Process direct conditions (uncommon but possible)
          if (condition.type && typeof condition.type === 'string') {
            types.add(condition.type);
          }

          // Handle baseAmount conditions (prioritize over amount)
          if (condition.baseAmount) {
            if (condition.baseAmount.gte !== undefined) {
              // Convert from base currency (USD) to selected currency for display
              const convertedMin = getExchangeAmount({
                amount: condition.baseAmount.gte,
                fromCurrency: currency,
                toCurrency: selectedCurrency,
              });
              currentAmountMin = convertedMin.convertedAmount;
            }
            if (condition.baseAmount.lte !== undefined) {
              // Convert from base currency (USD) to selected currency for display
              const convertedMax = getExchangeAmount({
                amount: condition.baseAmount.lte,
                fromCurrency: currency,
                toCurrency: selectedCurrency,
              });
              currentAmountMax = convertedMax.convertedAmount;
            }
          }
          // Fallback to amount conditions if baseAmount is not present
          else if (condition.amount) {
            if (condition.amount.gte !== undefined) currentAmountMin = condition.amount.gte;
            if (condition.amount.lte !== undefined) currentAmountMax = condition.amount.lte;
          }

          // Handle nested AND conditions for baseAmount and baseCurrency
          if (Array.isArray(condition.AND)) {
            condition.AND.forEach((nestedCondition) => {
              if (nestedCondition.baseAmount) {
                if (nestedCondition.baseAmount.gte !== undefined) {
                  // Convert from base currency (USD) to selected currency for display
                  const convertedMin = getExchangeAmount({
                    amount: nestedCondition.baseAmount.gte,
                    fromCurrency: currency,
                    toCurrency: selectedCurrency,
                  });
                  currentAmountMin = convertedMin.convertedAmount;
                }
                if (nestedCondition.baseAmount.lte !== undefined) {
                  // Convert from base currency (USD) to selected currency for display
                  const convertedMax = getExchangeAmount({
                    amount: nestedCondition.baseAmount.lte,
                    fromCurrency: currency,
                    toCurrency: selectedCurrency,
                  });
                  currentAmountMax = convertedMax.convertedAmount;
                }
              }
            });
          }

          // Handle date range in AND conditions (though less common)
          if (condition.date) {
            if (typeof condition.date === 'string') {
              // Single date value
              const dateValue = new Date(condition.date);
              dateFrom = dateValue;
              dateTo = dateValue;
            } else {
              // Date range object
              dateFrom = condition.date.gte ? new Date(condition.date.gte) : dateFrom;
              dateTo = condition.date.lte ? new Date(condition.date.lte) : dateTo;
            }
          }

          // Handle OR conditions for types
          if (
            Array.isArray(condition.OR) &&
            condition.OR.some((c) => 'type' in c && c.type !== undefined)
          ) {
            condition.OR.forEach((orCondition) => {
              if (
                'type' in orCondition &&
                orCondition.type &&
                typeof orCondition.type === 'string'
              ) {
                types.add(orCondition.type);
              }
            });
          }
        });
      }

      // Process flat filter structure for other properties
      if (!Array.isArray(filters?.AND) && typeof filters === 'object' && filters) {
        const flatFilters = filters;

        // Process baseAmount range (prioritize over amount)
        if (flatFilters.baseAmount) {
          if (flatFilters.baseAmount.gte !== undefined) {
            // Convert from base currency to selected currency for display
            const convertedMin = getExchangeAmount({
              amount: flatFilters.baseAmount.gte,
              fromCurrency: currency,
              toCurrency: selectedCurrency,
            });
            currentAmountMin = convertedMin.convertedAmount;
          }
          if (flatFilters.baseAmount.lte !== undefined) {
            // Convert from base currency to selected currency for display
            const convertedMax = getExchangeAmount({
              amount: flatFilters.baseAmount.lte,
              fromCurrency: currency,
              toCurrency: selectedCurrency,
            });
            currentAmountMax = convertedMax.convertedAmount;
          }
        }
        // Fallback to amount range
        else if (flatFilters.amount) {
          currentAmountMin =
            flatFilters.amount.gte !== undefined ? flatFilters.amount.gte : amountMin;
          currentAmountMax =
            flatFilters.amount.lte !== undefined ? flatFilters.amount.lte : amountMax;
        }
      }

      return {
        types: Array.from(types),
        amountMin: currentAmountMin,
        amountMax: currentAmountMax,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : undefined,
      };
    },
    [amountMin, amountMax, currency, selectedCurrency, getExchangeAmount],
  );

  // Sync filter params when filter criteria changes
  useEffect(() => {
    const extractedData = extractFilterData(filterCriteria.filters as FilterStructure);
    setFilterParams(extractedData);
  }, [filterCriteria, extractFilterData]);

  const handleEditFilter = useCallback((target: keyof FilterParams, value: unknown) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      [target]: value,
    }));
  }, []);

  // Create filter components configuration - each component is memoized
  const filterComponents = useMemo(() => {
    // Create memoized filter components
    const typeFilterComponent = (
      <MultiSelectFilter
        options={options}
        selectedValues={filterParams.types}
        onChange={(values) => handleEditFilter('types', values)}
        label="Saving Transaction Types"
        placeholder="Select types"
      />
    );

    const amountFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.amountMin}
        maxValue={filterParams.amountMax}
        minRange={0}
        maxRange={amountMax}
        onValueChange={(target, value) => {
          handleEditFilter(target === 'minValue' ? 'amountMin' : 'amountMax', value);
        }}
        label={`Amount (${selectedCurrency})`}
        minLabel="Min Amount"
        maxLabel="Max Amount"
        step={1000}
      />
    );

    const dateFilterComponent = (
      <DateRangeFilter
        dateRange={filterParams.dateRange}
        onChange={(values) => handleEditFilter('dateRange', values)}
        label="Date"
      />
    );

    return [
      {
        key: 'typeFilter',
        component: typeFilterComponent,
        column: FilterColumn.LEFT,
        order: 0,
      },
      {
        key: 'amountFilter',
        component: amountFilterComponent,
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'dateFilter',
        component: dateFilterComponent,
        column: FilterColumn.RIGHT,
        order: 0,
      },
    ];
  }, [filterParams, handleEditFilter, selectedCurrency]);

  const createFilterStructure = useCallback(
    (params: FilterParams): Record<string, any> => {
      const updatedFilters: Record<string, any> = {};

      const andConditions: any[] = [];

      // Handle date range - always place at top level
      if (params.dateRange?.from || params.dateRange?.to) {
        updatedFilters.date = {
          gte: params.dateRange?.from ? params.dateRange.from.toISOString() : null,
          lte: params.dateRange?.to ? params.dateRange.to.toISOString() : null,
        };
      }

      // Types OR group
      if (params.types?.length) {
        andConditions.push({
          OR: params.types.map((type) => ({ type })),
        });
      }

      // Amount with base currency conversion
      const minAmountInBaseCurrency = getExchangeAmount({
        amount: params.amountMin,
        fromCurrency: selectedCurrency,
        toCurrency: currency,
      });

      const maxAmountInBaseCurrency = getExchangeAmount({
        amount: params.amountMax,
        fromCurrency: selectedCurrency,
        toCurrency: currency,
      });

      andConditions.push({
        AND: [
          {
            amount: {
              gte: minAmountInBaseCurrency.convertedAmount,
              lte: maxAmountInBaseCurrency.convertedAmount,
            },
          },
          {
            currency: 'FX',
          },
        ],
      });

      // Add AND conditions if there are any
      if (andConditions.length > 0) {
        updatedFilters.AND = andConditions;
      }

      dispatch(
        updateAmountRange({
          min: minAmountInBaseCurrency.convertedAmount,
          max: maxAmountInBaseCurrency.convertedAmount,
        }),
      );

      return updatedFilters;
    },
    [currency, selectedCurrency, getExchangeAmount],
  );

  const resetFilter = () => {
    dispatch(
      updateAmountRange({
        min: 0,
        max: DEFAULT_MAX_AMOUNT,
      }),
    );

    setFilterParams({
      ...filterParamsInitState,
      amountMin: amountMin || 0,
      amountMax: amountMax || DEFAULT_MAX_AMOUNT,
    });

    callBack({
      ...filterCriteria,
      filters: {},
    });
  };

  return (
    <GlobalFilter
      filterParams={filterParams}
      filterComponents={components || filterComponents}
      onFilterChange={(newFilter) => {
        callBack({
          ...filterCriteria,
          filters: newFilter.filters,
        });
      }}
      defaultFilterCriteria={DEFAULT_SAVING_FILTER_CRITERIA}
      structureCreator={createFilterStructure}
      currentFilter={filterCriteria.filters}
      onResetFilter={resetFilter}
    />
  );
};

export default SavingFilterMenu;
