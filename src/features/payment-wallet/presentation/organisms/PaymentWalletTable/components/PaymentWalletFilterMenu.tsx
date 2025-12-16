import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { FilterColumn, FilterComponentConfig, FilterCriteria } from '@/shared/types';
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
// Updated to match API response, but keep optional legacy fields for backward compatibility
type PaymentWalletFilterOptionResponse = {
  // New API shape
  wallets?: string[];
  accounts?: string[];
  categories?: string[];
  memberships?: { name: string; id: string }[];
  amountMin: number | string;
  amountMax: number | string;

  // Legacy fields (optional) - for compatibility if backend returns old shape
  fromWallets?: WalletOption[];
  toWallets?: WalletOption[];
  fromAccounts?: WalletOption[];
  toAccounts?: WalletOption[];
  fromCategories?: WalletOption[];
  toCategories?: WalletOption[];
  membershipBenefits?: WalletOption[];
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

  // Persist server-provided amount range (converted to FX) to avoid fallback during revalidation
  const [amountRange, setAmountRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: DEFAULT_MAX_AMOUNT,
  });

  // Fetch filter options
  const { data, isLoading, mutate } = useDataFetch<PaymentWalletFilterOptionResponse>({
    endpoint: '/api/payment-wallet/options',
    method: 'GET',
  });

  // Fetch once on mount if needed
  useEffect(() => {
    if (typeof mutate === 'function') mutate();
  }, []);

  // Update filter params and stable amount range when server data is loaded or currency changes
  useEffect(() => {
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

      setAmountRange({
        min: convertedMin.convertedAmount,
        max: convertedMax.convertedAmount,
      });

      setFilterParams((prev) => ({
        ...prev,
        amountMin: convertedMin.convertedAmount,
        amountMax: convertedMax.convertedAmount,
      }));
    }
  }, [data, baseCurrency, getExchangeAmount]);

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
          if (condition.type) {
            if (typeof (condition as any).type === 'string') {
              types.add((condition as any).type);
            } else if (
              typeof (condition as any).type === 'object' &&
              Array.isArray((condition as any).type.in)
            ) {
              (condition as any).type.in.forEach((t: string) => types.add(t));
            }
          }

          // Collect direct entity IDs
          // Accounts by id or name (prefer name if present)
          if ((condition as any).toAccount?.name) accounts.add((condition as any).toAccount.name);
          else if (condition.toAccount?.id) accounts.add(condition.toAccount.id);
          if ((condition as any).fromAccount?.name)
            accounts.add((condition as any).fromAccount.name);
          else if (condition.fromAccount?.id) accounts.add(condition.fromAccount.id);

          // Categories by id or name (prefer name if present)
          if ((condition as any).toCategory?.name)
            categories.add((condition as any).toCategory.name);
          else if (condition.toCategory?.id) categories.add(condition.toCategory.id);
          if ((condition as any).fromCategory?.name)
            categories.add((condition as any).fromCategory.name);
          else if (condition.fromCategory?.id) categories.add(condition.fromCategory.id);

          // Membership by id or slug.in
          if (condition.membershipBenefit?.id) memberships.add(condition.membershipBenefit.id);
          const mbSlugIn: string[] | undefined = (condition as any)?.membershipBenefit?.slug?.in;
          if (Array.isArray(mbSlugIn)) mbSlugIn.forEach((s) => memberships.add(s));

          // Wallet type parsing removed

          // Handle amount conditions (prioritize 'amount' over 'baseAmount' to match API contract)
          if (condition.amount) {
            if (condition.amount.gte !== undefined) currentAmountMin = condition.amount.gte;
            if (condition.amount.lte !== undefined) currentAmountMax = condition.amount.lte;
          } else if (condition.baseAmount) {
            // Fallback: convert baseAmount from base currency to FX for display
            if (condition.baseAmount.gte !== undefined) {
              const convertedMin = getExchangeAmount({
                amount: condition.baseAmount.gte,
                fromCurrency: baseCurrency,
                toCurrency: CURRENCY.FX,
              });
              currentAmountMin = convertedMin.convertedAmount;
            }
            if (condition.baseAmount.lte !== undefined) {
              const convertedMax = getExchangeAmount({
                amount: condition.baseAmount.lte,
                fromCurrency: baseCurrency,
                toCurrency: CURRENCY.FX,
              });
              currentAmountMax = convertedMax.convertedAmount;
            }
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

          // Handle OR conditions for types (legacy structure)
          if (Array.isArray((condition as any).OR)) {
            (condition as any).OR.forEach((orCondition: any) => {
              if (orCondition && typeof orCondition === 'object' && 'type' in orCondition) {
                if (typeof orCondition.type === 'string') types.add(orCondition.type);
                else if (typeof orCondition.type === 'object' && Array.isArray(orCondition.type.in))
                  orCondition.type.in.forEach((t: string) => types.add(t));
              }
            });
          }

          // Handle OR entries that carry account/category/membership fields directly
          if (Array.isArray(condition.OR)) {
            condition.OR.forEach((entry: any) => {
              // Membership slug.in or id
              const eMbSlugIn: string[] | undefined = entry?.membershipBenefit?.slug?.in;
              if (Array.isArray(eMbSlugIn)) eMbSlugIn.forEach((s) => memberships.add(s));
              if (typeof entry?.membershipBenefit?.id === 'string')
                memberships.add(entry.membershipBenefit.id);

              // Accounts by name or id
              if (typeof entry?.toAccount?.name === 'string') accounts.add(entry.toAccount.name);
              else if (typeof entry?.toAccount?.id === 'string') accounts.add(entry.toAccount.id);
              if (typeof entry?.fromAccount?.name === 'string') {
                accounts.add(entry.fromAccount.name);
              } else if (typeof entry?.fromAccount?.id === 'string') {
                accounts.add(entry.fromAccount.id);
              }

              // Categories by name or id
              if (typeof entry?.toCategory?.name === 'string') {
                categories.add(entry.toCategory.name);
              } else if (typeof entry?.toCategory?.id === 'string') {
                categories.add(entry.toCategory.id);
              }
              if (typeof entry?.fromCategory?.name === 'string') {
                categories.add(entry.fromCategory.name);
              } else if (typeof entry?.fromCategory?.id === 'string') {
                categories.add(entry.fromCategory.id);
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
                  // Accounts by id or name
                  if ((n as any).toAccount?.name) accounts.add((n as any).toAccount.name);
                  else if (n.toAccount?.id) accounts.add(n.toAccount.id);
                  if ((n as any).fromAccount?.name) accounts.add((n as any).fromAccount.name);
                  else if (n.fromAccount?.id) accounts.add(n.fromAccount.id);

                  // Categories by id or name
                  if ((n as any).toCategory?.name) categories.add((n as any).toCategory.name);
                  else if (n.toCategory?.id) categories.add(n.toCategory.id);
                  if ((n as any).fromCategory?.name) categories.add((n as any).fromCategory.name);
                  else if (n.fromCategory?.id) categories.add(n.fromCategory.id);

                  // Membership id
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

        // Prefer 'amount' range; fallback to 'baseAmount' range
        if ((flatFilters as any).amount) {
          currentAmountMin =
            (flatFilters as any).amount.gte !== undefined ? (flatFilters as any).amount.gte : 0;
          currentAmountMax =
            (flatFilters as any).amount.lte !== undefined
              ? (flatFilters as any).amount.lte
              : DEFAULT_MAX_AMOUNT;
        } else if ((flatFilters as any).baseAmount) {
          if ((flatFilters as any).baseAmount.gte !== undefined) {
            const convertedMin = getExchangeAmount({
              amount: (flatFilters as any).baseAmount.gte,
              fromCurrency: baseCurrency,
              toCurrency: CURRENCY.FX,
            });
            currentAmountMin = convertedMin.convertedAmount;
          }
          if ((flatFilters as any).baseAmount.lte !== undefined) {
            const convertedMax = getExchangeAmount({
              amount: (flatFilters as any).baseAmount.lte,
              fromCurrency: baseCurrency,
              toCurrency: CURRENCY.FX,
            });
            currentAmountMax = convertedMax.convertedAmount;
          }
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
    const map = new Map<string, { label: string; value: string }>();

    // New API: accounts is an array of strings
    const accountNames = data?.data?.accounts || [];
    accountNames.forEach((name) => {
      if (typeof name === 'string' && name && !map.has(name)) {
        map.set(name, { label: name, value: name });
      }
    });

    // Legacy fallback: merge from/to account options if present
    const fromLegacy = data?.data?.fromAccounts || [];
    const toLegacy = data?.data?.toAccounts || [];
    [...fromLegacy, ...toLegacy].forEach((a) => {
      if (a?.value && !map.has(a.value)) map.set(a.value, { label: a.label, value: a.value });
    });

    return Array.from(map.values());
  }, [data]);

  // Options for Categories
  const categoryOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    // New API: categories is an array of strings
    const categoryNames = data?.data?.categories || [];
    categoryNames.forEach((name) => {
      if (typeof name === 'string' && name && !map.has(name)) {
        map.set(name, { label: name, value: name });
      }
    });

    // Legacy fallback: merge from/to category options if present
    const fromLegacy = data?.data?.fromCategories || [];
    const toLegacy = data?.data?.toCategories || [];
    [...fromLegacy, ...toLegacy].forEach((c) => {
      if (c?.value && !map.has(c.value)) map.set(c.value, { label: c.label, value: c.value });
    });

    return Array.from(map.values());
  }, [data]);

  // Options for Membership Benefits
  const membershipOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    // New API: memberships is an array of { name, id }
    const memberships = data?.data?.memberships || [];
    memberships.forEach((m) => {
      const id = (m as any)?.id;
      const name = (m as any)?.name;
      if (typeof id === 'string' && id) {
        const label = typeof name === 'string' && name ? name : id;
        if (!map.has(id)) map.set(id, { label, value: id });
      }
    });

    // Legacy fallback: membershipBenefits already in label/value shape
    const legacy = data?.data?.membershipBenefits || [];
    legacy.forEach((m) => {
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
        maxRange={amountRange.max}
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

      // Types as an 'in' condition to match backend contract
      if (params.types?.length) {
        andConditions.push({
          type: { in: [...params.types] },
        });
      }

      // Partner/Category/Account filters removed

      // Wallets filter removed

      // Accounts OR group - flatten to single OR with toAccount/fromAccount for each name
      if (params.accounts?.length) {
        const orAccounts = params.accounts.flatMap((name) => [
          { toAccount: { name } },
          { fromAccount: { name } },
        ]);
        andConditions.push({ OR: orAccounts });
      }

      // Categories OR group - flatten to single OR with toCategory/fromCategory for each name
      if (params.categories?.length) {
        const orCategories = params.categories.flatMap((name) => [
          { toCategory: { name } },
          { fromCategory: { name } },
        ]);
        andConditions.push({ OR: orCategories });
      }

      // Memberships as direct AND condition using slug.in (matches contract)
      if (params.memberships?.length) {
        andConditions.push({
          membershipBenefit: {
            slug: {
              in: [...params.memberships],
            },
          },
        });
      }

      // Amount range on 'amount' field (no base conversion) to match contract
      andConditions.push({
        amount: {
          gte: params.amountMin,
          lte: params.amountMax,
        },
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
