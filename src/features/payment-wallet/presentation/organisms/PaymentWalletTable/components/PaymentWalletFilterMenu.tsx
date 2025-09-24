import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { useCurrencyFormatter } from '@/shared/hooks';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { FilterColumn, FilterComponentConfig, FilterCriteria } from '@/shared/types/filter.types';
import { useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

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

interface WalletCondition {
  toWallet?: {
    type?: string;
  };
  fromWallet?: {
    type?: string;
  };
}

interface TypeCondition {
  type?: string;
}

interface NestedOrCondition {
  OR?: WalletCondition[];
}

interface FilterAndCondition {
  type?: string;
  toWallet?: {
    type?: string;
  };
  fromWallet?: {
    type?: string;
  };
  amount?: AmountCondition;
  baseAmount?: BaseAmountCondition;
  baseCurrency?: string;
  date?: string | DateCondition;
  OR?: (TypeCondition | NestedOrCondition)[];
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
  wallets: string[];
  amountMin: number;
  amountMax: number;
};

const filterParamsInitState: FilterParams = {
  dateRange: undefined,
  types: [],
  wallets: [],
  amountMin: 0,
  amountMax: DEFAULT_MAX_AMOUNT,
};

type PaymentWalletFilterOptionResponse = {
  wallets: string[];
  amountMin: number;
  amountMax: number;
};

type PaymentWalletFilterMenuProps<T> = {
  callBack: (newFilter: FilterCriteria) => void;
  components?: FilterComponentConfig[];
  filterParams?: T;
};

const options = [
  { value: 'Expense', label: 'Expense' },
  { value: 'Income', label: 'Income' },
  { value: 'Transfer', label: 'Transfer' },
];

const DEFAULT_PAYMENT_WALLET_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
  search: '',
};

const PaymentWalletFilterMenu = <T extends Record<string, unknown>>(
  props: PaymentWalletFilterMenuProps<T>,
) => {
  const { callBack, components } = props;
  const { currency: selectedCurrency, baseCurrency } = useAppSelector((state) => state.settings);
  const { getExchangeAmount } = useCurrencyFormatter();

  // Get current filter criteria from payment wallet state
  const filterCriteria = useAppSelector((state) => state.paymentWallet.filterCriteria);

  // State for managing filter parameters
  const [filterParams, setFilterParams] = useState<FilterParams>({
    ...filterParamsInitState,
  });

  // Fetch filter options
  const { data, isLoading, mutate } = useDataFetch<PaymentWalletFilterOptionResponse>({
    endpoint: '/api/payment-wallet/options',
    method: 'GET',
    refreshInterval: 1000 * 60 * 5,
  });

  // Update filter params when server data is loaded
  useEffect(() => {
    mutate();
    if (data?.data?.amountMin !== undefined && data?.data?.amountMax !== undefined) {
      // Server returns amounts in base currency, convert to selected currency for display
      const convertedMin = getExchangeAmount({
        amount: data.data.amountMin,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      const convertedMax = getExchangeAmount({
        amount: data.data.amountMax,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      setFilterParams((prev) => ({
        ...prev,
        amountMin: convertedMin.convertedAmount,
        amountMax: convertedMax.convertedAmount,
      }));
    }
  }, [data, baseCurrency, selectedCurrency, getExchangeAmount, mutate]);

  // Extract filter data from complex filter structure
  const extractFilterData = useCallback(
    (filters: FilterStructure) => {
      const types: Set<string> = new Set();
      const wallets: Set<string> = new Set();
      let currentAmountMin = 0;
      let currentAmountMax = DEFAULT_MAX_AMOUNT;
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
          // Process direct conditions
          if (condition.type && typeof condition.type === 'string') {
            types.add(condition.type);
          }

          if (condition.toWallet?.type) wallets.add(condition.toWallet.type);
          if (condition.fromWallet?.type) wallets.add(condition.fromWallet.type);

          // Handle baseAmount conditions (prioritize over amount)
          if (condition.baseAmount) {
            if (condition.baseAmount.gte !== undefined) {
              // Convert from base currency (USD) to selected currency for display
              const convertedMin = getExchangeAmount({
                amount: condition.baseAmount.gte,
                fromCurrency: baseCurrency,
                toCurrency: selectedCurrency,
              });
              currentAmountMin = convertedMin.convertedAmount;
            }
            if (condition.baseAmount.lte !== undefined) {
              // Convert from base currency (USD) to selected currency for display
              const convertedMax = getExchangeAmount({
                amount: condition.baseAmount.lte,
                fromCurrency: baseCurrency,
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
                    fromCurrency: baseCurrency,
                    toCurrency: selectedCurrency,
                  });
                  currentAmountMin = convertedMin.convertedAmount;
                }
                if (nestedCondition.baseAmount.lte !== undefined) {
                  // Convert from base currency (USD) to selected currency for display
                  const convertedMax = getExchangeAmount({
                    amount: nestedCondition.baseAmount.lte,
                    fromCurrency: baseCurrency,
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

          // Partner/Account filters removed for Payment Wallet filter

          // Handle OR conditions for wallets with special nested structure
          if (
            Array.isArray(condition.OR) &&
            condition.OR.some(
              (c) =>
                'OR' in c &&
                Array.isArray((c as NestedOrCondition).OR) &&
                (c as NestedOrCondition).OR!.some(
                  (n) =>
                    ('toWallet' in n && (n as WalletCondition).toWallet?.type !== undefined) ||
                    ('fromWallet' in n && (n as WalletCondition).fromWallet?.type !== undefined),
                ),
            )
          ) {
            condition.OR.forEach((orCondition) => {
              if ('OR' in orCondition && Array.isArray((orCondition as NestedOrCondition).OR)) {
                (orCondition as NestedOrCondition).OR!.forEach((nested) => {
                  if ('toWallet' in nested && (nested as WalletCondition).toWallet?.type) {
                    wallets.add((nested as WalletCondition).toWallet!.type!);
                  }
                  if ('fromWallet' in nested && (nested as WalletCondition).fromWallet?.type) {
                    wallets.add((nested as WalletCondition).fromWallet!.type!);
                  }
                });
              }
            });
          }

          // Categories removed for Payment Wallet filter
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
              fromCurrency: baseCurrency,
              toCurrency: selectedCurrency,
            });
            currentAmountMin = convertedMin.convertedAmount;
          }
          if (flatFilters.baseAmount.lte !== undefined) {
            // Convert from base currency to selected currency for display
            const convertedMax = getExchangeAmount({
              amount: flatFilters.baseAmount.lte,
              fromCurrency: baseCurrency,
              toCurrency: selectedCurrency,
            });
            currentAmountMax = convertedMax.convertedAmount;
          }
        }
        // Fallback to amount range
        else if (flatFilters.amount) {
          currentAmountMin = flatFilters.amount.gte !== undefined ? flatFilters.amount.gte : 0;
          currentAmountMax =
            flatFilters.amount.lte !== undefined ? flatFilters.amount.lte : DEFAULT_MAX_AMOUNT;
        }
      }

      return {
        types: Array.from(types),
        wallets: Array.from(wallets),
        amountMin: currentAmountMin,
        amountMax: currentAmountMax,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : undefined,
      };
    },
    [baseCurrency, selectedCurrency, getExchangeAmount],
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
        label="Transaction Types"
        placeholder="Select types"
        disabled={isLoading}
      />
    );

    const walletOptions = (() => {
      if (!data?.data?.wallets) {
        return [{ label: 'No option available', value: 'none', disabled: true }];
      }
      return data.data.wallets.map((option: string) => ({ value: option, label: option }));
    })();

    const amountFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.amountMin}
        maxValue={filterParams.amountMax}
        minRange={0}
        maxRange={
          data?.data?.amountMax
            ? getExchangeAmount({
                amount: data.data.amountMax,
                fromCurrency: baseCurrency,
                toCurrency: selectedCurrency,
              }).convertedAmount
            : DEFAULT_MAX_AMOUNT
        }
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'amountMin' : 'amountMax', value)
        }
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

    const walletFilterComponent = (
      <MultiSelectFilter
        options={walletOptions}
        selectedValues={filterParams.wallets}
        onChange={(values) => handleEditFilter('wallets', values)}
        label="Wallets"
        placeholder="Select wallets"
        disabled={isLoading}
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
        order: 1,
      },
      {
        key: 'walletFilter',
        component: walletFilterComponent,
        column: FilterColumn.RIGHT,
        order: 0,
      },
    ];
  }, [filterParams, isLoading, handleEditFilter, selectedCurrency, data?.data?.wallets]);

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

      // Partner/Category/Account filters removed

      // Wallets OR group
      if (params.wallets?.length) {
        andConditions.push({
          OR: params.wallets.map((wallet) => ({
            OR: [{ toWallet: { type: wallet } }, { fromWallet: { type: wallet } }],
          })),
        });
      }

      // Amount with base currency conversion - always include like Transaction FilterMenu
      const minAmountInBaseCurrency = getExchangeAmount({
        amount: params.amountMin,
        fromCurrency: selectedCurrency,
        toCurrency: baseCurrency,
      });

      const maxAmountInBaseCurrency = getExchangeAmount({
        amount: params.amountMax,
        fromCurrency: selectedCurrency,
        toCurrency: baseCurrency,
      });

      andConditions.push({
        AND: [
          {
            baseAmount: {
              gte: minAmountInBaseCurrency.convertedAmount,
              lte: maxAmountInBaseCurrency.convertedAmount,
            },
          },
          {
            baseCurrency: baseCurrency,
          },
        ],
      });

      // Add AND conditions if there are any
      if (andConditions.length > 0) {
        updatedFilters.AND = andConditions;
      }

      return updatedFilters;
    },
    [baseCurrency, selectedCurrency, getExchangeAmount],
  );

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
      defaultFilterCriteria={DEFAULT_PAYMENT_WALLET_FILTER_CRITERIA}
      structureCreator={createFilterStructure}
      currentFilter={filterCriteria.filters}
    />
  );
};

export default PaymentWalletFilterMenu;
