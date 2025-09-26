import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { CURRENCY } from '@/shared/constants';
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

// Entity condition supporting IDs across Wallet, Account, Category, and Membership
interface EntityIdCondition {
  toWallet?: { id?: string; type?: string };
  fromWallet?: { id?: string; type?: string };
  toAccount?: { id?: string };
  fromAccount?: { id?: string };
  toCategory?: { id?: string };
  fromCategory?: { id?: string };
  membershipBenefit?: { id?: string };
}

interface TypeCondition {
  type?: string;
}

interface NestedOrCondition {
  OR?: EntityIdCondition[];
}

interface FilterAndCondition {
  type?: string;
  toWallet?: { id?: string; type?: string }; // legacy type kept
  fromWallet?: { id?: string; type?: string }; // legacy type kept
  toAccount?: { id?: string };
  fromAccount?: { id?: string };
  toCategory?: { id?: string };
  fromCategory?: { id?: string };
  membershipBenefit?: { id?: string };
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
  accounts: string[];
  categories: string[];
  memberships: string[];
  amountMin: number;
  amountMax: number;
};

const filterParamsInitState: FilterParams = {
  dateRange: undefined,
  types: [],
  accounts: [],
  categories: [],
  memberships: [],
  amountMin: 0,
  amountMax: DEFAULT_MAX_AMOUNT,
};

// Adjust response type to reflect actual API shape
type WalletOption = { label: string; value: string };
type PaymentWalletFilterOptionResponse = {
  fromWallets: WalletOption[];
  toWallets: WalletOption[];
  fromAccounts?: WalletOption[];
  toAccounts?: WalletOption[];
  fromCategories?: WalletOption[];
  toCategories?: WalletOption[];
  membershipBenefits?: WalletOption[];
  amountMin: number | string;
  amountMax: number | string;
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
  const { baseCurrency } = useAppSelector((state) => state.settings);
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
        amount: Number(data.data.amountMin),
        fromCurrency: baseCurrency,
        toCurrency: CURRENCY.FX,
      });

      const convertedMax = getExchangeAmount({
        amount: Number(data.data.amountMax),
        fromCurrency: baseCurrency,
        toCurrency: CURRENCY.FX,
      });

      setFilterParams((prev) => ({
        ...prev,
        amountMin: convertedMin.convertedAmount,
        amountMax: convertedMax.convertedAmount,
      }));
    }
  }, [data, baseCurrency, getExchangeAmount, mutate]);

  // Extract filter data from complex filter structure
  const extractFilterData = useCallback(
    (filters: FilterStructure) => {
      const types: Set<string> = new Set();
      const accounts: Set<string> = new Set();
      const categories: Set<string> = new Set();
      const memberships: Set<string> = new Set();
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

          // Collect direct entity IDs
          if (condition.toAccount?.id) accounts.add(condition.toAccount.id);
          if (condition.fromAccount?.id) accounts.add(condition.fromAccount.id);
          if (condition.toCategory?.id) categories.add(condition.toCategory.id);
          if (condition.fromCategory?.id) categories.add(condition.fromCategory.id);
          if (condition.membershipBenefit?.id) memberships.add(condition.membershipBenefit.id);

          // Handle baseAmount conditions (prioritize over amount)
          if (condition.baseAmount) {
            if (condition.baseAmount.gte !== undefined) {
              // Convert from base currency (USD) to selected currency for display
              const convertedMin = getExchangeAmount({
                amount: condition.baseAmount.gte,
                fromCurrency: baseCurrency,
                toCurrency: CURRENCY.FX,
              });
              currentAmountMin = convertedMin.convertedAmount;
            }
            if (condition.baseAmount.lte !== undefined) {
              // Convert from base currency (USD) to selected currency for display
              const convertedMax = getExchangeAmount({
                amount: condition.baseAmount.lte,
                fromCurrency: baseCurrency,
                toCurrency: CURRENCY.FX,
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
                    toCurrency: CURRENCY.FX,
                  });
                  currentAmountMin = convertedMin.convertedAmount;
                }
                if (nestedCondition.baseAmount.lte !== undefined) {
                  // Convert from base currency (USD) to selected currency for display
                  const convertedMax = getExchangeAmount({
                    amount: nestedCondition.baseAmount.lte,
                    fromCurrency: baseCurrency,
                    toCurrency: CURRENCY.FX,
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

          // Handle nested OR conditions that may include any entity ID (wallet/account/category/membership)
          if (
            Array.isArray(condition.OR) &&
            condition.OR.some((c) => 'OR' in c && Array.isArray((c as NestedOrCondition).OR))
          ) {
            condition.OR.forEach((orCondition) => {
              if ('OR' in orCondition && Array.isArray((orCondition as NestedOrCondition).OR)) {
                (orCondition as NestedOrCondition).OR!.forEach((nested) => {
                  const n = nested as EntityIdCondition;
                  if (n.toAccount?.id) accounts.add(n.toAccount.id);
                  if (n.fromAccount?.id) accounts.add(n.fromAccount.id);
                  if (n.toCategory?.id) categories.add(n.toCategory.id);
                  if (n.fromCategory?.id) categories.add(n.fromCategory.id);
                  if (n.membershipBenefit?.id) memberships.add(n.membershipBenefit.id);
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
              toCurrency: CURRENCY.FX,
            });
            currentAmountMin = convertedMin.convertedAmount;
          }
          if (flatFilters.baseAmount.lte !== undefined) {
            // Convert from base currency to selected currency for display
            const convertedMax = getExchangeAmount({
              amount: flatFilters.baseAmount.lte,
              fromCurrency: baseCurrency,
              toCurrency: CURRENCY.FX,
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
        accounts: Array.from(accounts),
        categories: Array.from(categories),
        memberships: Array.from(memberships),
        amountMin: currentAmountMin,
        amountMax: currentAmountMax,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : undefined,
      };
    },
    [baseCurrency, CURRENCY.FX, getExchangeAmount],
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

  // Memoized options for Accounts/Categories/Memberships
  // Options for Accounts
  const accountOptions = useMemo(() => {
    const from = data?.data?.fromAccounts || [];
    const to = data?.data?.toAccounts || [];
    const merged = [...from, ...to];
    const map = new Map<string, { label: string; value: string }>();
    merged.forEach((a) => {
      if (a?.value && !map.has(a.value)) map.set(a.value, { label: a.label, value: a.value });
    });
    return Array.from(map.values());
  }, [data]);

  // Options for Categories
  const categoryOptions = useMemo(() => {
    const from = data?.data?.fromCategories || [];
    const to = data?.data?.toCategories || [];
    const merged = [...from, ...to];
    const map = new Map<string, { label: string; value: string }>();
    merged.forEach((c) => {
      if (c?.value && !map.has(c.value)) map.set(c.value, { label: c.label, value: c.value });
    });
    return Array.from(map.values());
  }, [data]);

  // Options for Membership Benefits
  const membershipOptions = useMemo(() => {
    const merged = data?.data?.membershipBenefits || [];
    const map = new Map<string, { label: string; value: string }>();
    merged.forEach((m) => {
      if (m?.value && !map.has(m.value)) map.set(m.value, { label: m.label, value: m.value });
    });
    return Array.from(map.values());
  }, [data]);

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

    const amountFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.amountMin}
        maxValue={filterParams.amountMax}
        minRange={0}
        maxRange={
          data?.data?.amountMax
            ? getExchangeAmount({
                amount: Number(data.data.amountMax),
                fromCurrency: baseCurrency,
                toCurrency: CURRENCY.FX,
              }).convertedAmount
            : DEFAULT_MAX_AMOUNT
        }
        currency={CURRENCY.FX}
        targetCurrency={CURRENCY.FX}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'amountMin' : 'amountMax', value)
        }
        label={`Amount (${CURRENCY.FX})`}
        minLabel="Min Amount"
        maxLabel="Max Amount"
        applyExchangeRate={false}
      />
    );

    const dateFilterComponent = (
      <DateRangeFilter
        dateRange={filterParams.dateRange}
        onChange={(values) => handleEditFilter('dateRange', values)}
        label="Date"
      />
    );

    const accountFilterComponent = (
      <MultiSelectFilter
        options={accountOptions}
        selectedValues={filterParams.accounts}
        onChange={(values) => handleEditFilter('accounts', values)}
        label="Accounts"
        placeholder="Select accounts"
        disabled={isLoading}
      />
    );

    const categoryFilterComponent = (
      <MultiSelectFilter
        options={categoryOptions}
        selectedValues={filterParams.categories}
        onChange={(values) => handleEditFilter('categories', values)}
        label="Categories"
        placeholder="Select categories"
        disabled={isLoading}
      />
    );

    const membershipFilterComponent = (
      <MultiSelectFilter
        options={membershipOptions}
        selectedValues={filterParams.memberships}
        onChange={(values) => handleEditFilter('memberships', values)}
        label="Memberships"
        placeholder="Select memberships"
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
        order: 2,
      },
      {
        key: 'dateFilter',
        component: dateFilterComponent,
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'accountFilter',
        component: accountFilterComponent,
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'categoryFilter',
        component: categoryFilterComponent,
        column: FilterColumn.RIGHT,
        order: 1,
      },
      {
        key: 'membershipFilter',
        component: membershipFilterComponent,
        column: FilterColumn.RIGHT,
        order: 2,
      },
    ];
  }, [
    filterParams,
    isLoading,
    handleEditFilter,
    CURRENCY.FX,
    accountOptions,
    categoryOptions,
    membershipOptions,
  ]);

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

      // Accounts OR group
      if (params.accounts?.length) {
        andConditions.push({
          OR: params.accounts.map((id) => ({
            OR: [{ toAccount: { id } }, { fromAccount: { id } }],
          })),
        });
      }

      // Categories OR group
      if (params.categories?.length) {
        andConditions.push({
          OR: params.categories.map((id) => ({
            OR: [{ toCategory: { id } }, { fromCategory: { id } }],
          })),
        });
      }

      // Memberships OR group
      if (params.memberships?.length) {
        andConditions.push({ OR: params.memberships.map((id) => ({ membershipBenefit: { id } })) });
      }

      // Amount with base currency conversion - always include like Transaction FilterMenu
      const minAmountInBaseCurrency = getExchangeAmount({
        amount: params.amountMin,
        fromCurrency: CURRENCY.FX,
        toCurrency: baseCurrency,
      });

      const maxAmountInBaseCurrency = getExchangeAmount({
        amount: params.amountMax,
        fromCurrency: CURRENCY.FX,
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
    [baseCurrency, CURRENCY.FX, getExchangeAmount],
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
