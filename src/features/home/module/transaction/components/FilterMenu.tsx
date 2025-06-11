import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { FilterColumn, FilterComponentConfig, FilterCriteria } from '@/shared/types/filter.types';
import { useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { TransactionFilterOptionResponse } from '../types';
import { DEFAULT_TRANSACTION_FILTER_CRITERIA } from '../utils/constants';

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

interface PartnerCondition {
  partner?: {
    name?: string;
  };
}

interface AccountCondition {
  toAccount?: {
    name?: string;
  };
  fromAccount?: {
    name?: string;
  };
}

interface CategoryCondition {
  toCategory?: {
    name?: string;
  };
  fromCategory?: {
    name?: string;
  };
}

interface TypeCondition {
  type?: string;
}

interface NestedOrCondition {
  OR?: (AccountCondition | CategoryCondition)[];
}

interface FilterAndCondition {
  type?: string;
  partner?: {
    name?: string;
  };
  fromCategory?: {
    name?: string;
  };
  toCategory?: {
    name?: string;
  };
  fromAccount?: {
    name?: string;
  };
  toAccount?: {
    name?: string;
  };
  amount?: AmountCondition;
  date?: string | DateCondition;
  OR?: (TypeCondition | PartnerCondition | NestedOrCondition)[];
}

interface FilterStructure {
  AND?: FilterAndCondition[];
  date?: string | DateCondition;
  amount?: AmountCondition;
}

type FilterParams = {
  dateRange?: DateRange;
  types: string[];
  partners: string[];
  categories: string[];
  accounts: string[];
  amountMin: number;
  amountMax: number;
};

const filterParamsInitState: FilterParams = {
  dateRange: undefined,
  types: [],
  partners: [],
  categories: [],
  accounts: [],
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

const FilterMenu = <T extends Record<string, unknown>>(props: FilterMenuProps<T>) => {
  const { callBack, components } = props;
  const { amountMin, amountMax, filterCriteria } = useAppSelector((state) => state.transaction);

  // State for managing filter parameters
  const [filterParams, setFilterParams] = useState<FilterParams>({
    ...filterParamsInitState,
    amountMin: amountMin || 0,
    amountMax: amountMax || DEFAULT_MAX_AMOUNT,
  });

  // Fetch filter options
  const { data, isLoading } = useDataFetcher<TransactionFilterOptionResponse>({
    endpoint: '/api/transactions/options',
    method: 'GET',
  });

  // Update filter params when server data is loaded
  useEffect(() => {
    if (data?.data?.amountMin !== undefined && data?.data?.amountMax !== undefined) {
      setFilterParams((prev) => ({
        ...prev,
        amountMin: Math.max(prev.amountMin, data.data.amountMin),
        amountMax: Math.min(prev.amountMax, data.data.amountMax),
      }));
    }
  }, [data]);

  // Extract filter data from complex filter structure
  const extractFilterData = useCallback(
    (filters: FilterStructure) => {
      const types: Set<string> = new Set();
      const partners: Set<string> = new Set();
      const categories: Set<string> = new Set();
      const accounts: Set<string> = new Set();
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

          if (condition.partner?.name) {
            partners.add(condition.partner.name);
          }

          if (condition.fromCategory?.name) categories.add(condition.fromCategory.name);
          if (condition.toCategory?.name) categories.add(condition.toCategory.name);
          if (condition.fromAccount?.name) accounts.add(condition.fromAccount.name);
          if (condition.toAccount?.name) accounts.add(condition.toAccount.name);

          // Handle amount conditions
          if (condition.amount) {
            if (condition.amount.gte !== undefined) currentAmountMin = condition.amount.gte;
            if (condition.amount.lte !== undefined) currentAmountMax = condition.amount.lte;
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

          // Handle OR conditions for partners
          if (
            Array.isArray(condition.OR) &&
            condition.OR.some((c) => 'partner' in c && c.partner?.name !== undefined)
          ) {
            condition.OR.forEach((orCondition) => {
              if ('partner' in orCondition && orCondition.partner?.name) {
                partners.add(orCondition.partner.name);
              }
            });
          }

          // Handle OR conditions for accounts with special nested structure
          if (
            Array.isArray(condition.OR) &&
            condition.OR.some(
              (c) =>
                'OR' in c &&
                Array.isArray(c.OR) &&
                c.OR.some(
                  (n) =>
                    ('toAccount' in n && n.toAccount?.name !== undefined) ||
                    ('fromAccount' in n && n.fromAccount?.name !== undefined),
                ),
            )
          ) {
            condition.OR.forEach((orGroup) => {
              if ('OR' in orGroup && Array.isArray(orGroup.OR)) {
                orGroup.OR.forEach((nestedOrCondition) => {
                  if ('toAccount' in nestedOrCondition && nestedOrCondition.toAccount?.name)
                    accounts.add(nestedOrCondition.toAccount.name);
                  if ('fromAccount' in nestedOrCondition && nestedOrCondition.fromAccount?.name)
                    accounts.add(nestedOrCondition.fromAccount.name);
                });
              }
            });
          }

          // Handle OR conditions for categories with special nested structure
          if (
            Array.isArray(condition.OR) &&
            condition.OR.some(
              (c) =>
                'OR' in c &&
                Array.isArray(c.OR) &&
                c.OR.some(
                  (n) =>
                    ('toCategory' in n && n.toCategory?.name !== undefined) ||
                    ('fromCategory' in n && n.fromCategory?.name !== undefined),
                ),
            )
          ) {
            condition.OR.forEach((orGroup) => {
              if ('OR' in orGroup && Array.isArray(orGroup.OR)) {
                orGroup.OR.forEach((nestedOrCondition) => {
                  if ('toCategory' in nestedOrCondition && nestedOrCondition.toCategory?.name)
                    categories.add(nestedOrCondition.toCategory.name);
                  if ('fromCategory' in nestedOrCondition && nestedOrCondition.fromCategory?.name)
                    categories.add(nestedOrCondition.fromCategory.name);
                });
              }
            });
          }
        });
      }

      // Process flat filter structure for other properties
      if (!Array.isArray(filters?.AND) && typeof filters === 'object' && filters) {
        const flatFilters = filters;

        // Process amount range
        if (flatFilters.amount) {
          currentAmountMin =
            flatFilters.amount.gte !== undefined ? flatFilters.amount.gte : amountMin;
          currentAmountMax =
            flatFilters.amount.lte !== undefined ? flatFilters.amount.lte : amountMax;
        }
      }

      return {
        types: Array.from(types),
        partners: Array.from(partners),
        categories: Array.from(categories),
        accounts: Array.from(accounts),
        amountMin: currentAmountMin,
        amountMax: currentAmountMax,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : undefined,
      };
    },
    [amountMin, amountMax],
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

  // Options for filter selects - memoized to prevent re-renders
  const partnerOptions = useMemo(() => {
    if (!data?.data?.partners) {
      return [{ label: 'No option available', value: 'none', disabled: true }];
    }

    return data.data.partners.map((option: string) => ({
      value: option,
      label: option,
    }));
  }, [data]);

  const accountOptions = useMemo(() => {
    if (!data?.data?.accounts) {
      return [{ label: 'No option available', value: 'none', disabled: true }];
    }

    return data.data.accounts.map((option: string) => ({
      value: option,
      label: option,
    }));
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (!data?.data?.categories) {
      return [{ label: 'No option available', value: 'none', disabled: true }];
    }

    return data.data.categories.map((option: string) => ({
      value: option,
      label: option,
    }));
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

    const amountFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.amountMin}
        maxValue={filterParams.amountMax}
        minRange={0}
        maxRange={data?.data?.amountMax ?? 0}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'amountMin' : 'amountMax', value)
        }
        label="Amount"
        minLabel="Min Amount"
        maxLabel="Max Amount"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `${value.toLocaleString()} USD`}
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

    const partnerFilterComponent = (
      <MultiSelectFilter
        options={partnerOptions}
        selectedValues={filterParams.partners}
        onChange={(values) => handleEditFilter('partners', values)}
        label="Partners"
        placeholder="Select partners"
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
        key: 'categoryFilter',
        component: categoryFilterComponent,
        column: FilterColumn.LEFT,
        order: 1,
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
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'accountFilter',
        component: accountFilterComponent,
        column: FilterColumn.RIGHT,
        order: 1,
      },
      {
        key: 'partnerFilter',
        component: partnerFilterComponent,
        column: FilterColumn.RIGHT,
        order: 2,
      },
    ];
  }, [filterParams, categoryOptions, accountOptions, partnerOptions, isLoading, handleEditFilter]);

  const createFilterStructure = useCallback((params: FilterParams): Record<string, any> => {
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

    // Partners OR group
    if (params.partners?.length) {
      andConditions.push({
        OR: params.partners.map((partner) => ({ partner: { name: partner } })),
      });
    }

    // Categories OR group
    if (params.categories?.length) {
      andConditions.push({
        OR: params.categories.map((category) => ({
          OR: [{ toCategory: { name: category } }, { fromCategory: { name: category } }],
        })),
      });
    }

    // Accounts OR group
    if (params.accounts?.length) {
      andConditions.push({
        OR: params.accounts.map((account) => ({
          OR: [{ toAccount: { name: account } }, { fromAccount: { name: account } }],
        })),
      });
    }

    // Amount as a separate condition
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
  }, []);

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
      defaultFilterCriteria={DEFAULT_TRANSACTION_FILTER_CRITERIA}
      structureCreator={createFilterStructure}
      currentFilter={filterCriteria.filters}
    />
  );
};

export default FilterMenu;
