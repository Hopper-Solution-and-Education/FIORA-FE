import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { useCurrencyFormatter } from '@/shared/hooks';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { setFilterCriteria } from '../slices';
import { searchAccounts } from '../slices/actions';

// Define constants for magic numbers
const DEFAULT_MIN_BALANCE = 0;
const DEFAULT_MAX_BALANCE = 1000000;
const DEFAULT_SLIDER_STEP = 1000;

// Fixed account type options
const ACCOUNT_TYPE_OPTIONS = [
  { value: 'Payment', label: 'Payment' },
  { value: 'Saving', label: 'Saving' },
  { value: 'CreditCard', label: 'Credit Card' },
  { value: 'Debt', label: 'Debt' },
  { value: 'Lending', label: 'Lending' },
  { value: 'Invest', label: 'Invest' },
];

// Default filter criteria for account module
const DEFAULT_ACCOUNT_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

interface RangeCondition {
  gte?: number;
  lte?: number;
}

interface BaseAmountCondition {
  gte?: number;
  lte?: number;
}

interface TypeCondition {
  in?: string[];
}

interface FilterAndCondition {
  baseAmount?: BaseAmountCondition;
  baseCurrency?: string;
}

interface FilterStructure {
  type?: TypeCondition;
  balance?: RangeCondition;
  AND?: FilterAndCondition[];
}

// Local FilterParams interface for account filtering
interface AccountFilterParams {
  accountTypes: string[];
  balanceMin: number;
  balanceMax: number;
}

const filterParamsInitState: AccountFilterParams = {
  accountTypes: [],
  balanceMin: DEFAULT_MIN_BALANCE,
  balanceMax: DEFAULT_MAX_BALANCE,
};

interface FilterMenuProps {
  onFilterChange: (newFilter: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
}

const FilterMenu = ({ onFilterChange, filterCriteria }: FilterMenuProps) => {
  // Get min/max balance values from Redux state (calculated by the API)
  const { minBalance, maxBalance } = useAppSelector((state) => state.account);
  const { currency: selectedCurrency, baseCurrency } = useAppSelector((state) => state.settings);
  const { getExchangeAmount } = useCurrencyFormatter();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const dispatch = useAppDispatch();

  // State for filter parameters
  const [filterParams, setFilterParams] = useState<AccountFilterParams>(filterParamsInitState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate min/max balance values from Redux state or use defaults
  const accountStatistics = useMemo(() => {
    return {
      minBalance: minBalance ?? DEFAULT_MIN_BALANCE,
      maxBalance: maxBalance ?? DEFAULT_MAX_BALANCE,
    };
  }, [minBalance, maxBalance]);

  // Extract filter data from filters object
  const extractFilterData = useCallback(
    (filterCriteria: Record<string, unknown>) => {
      try {
        // Initialize with default values
        let accountTypes: string[] = [];
        let currentBalanceMin = accountStatistics.minBalance;
        let currentBalanceMax = accountStatistics.maxBalance;

        // Validate input
        if (!filterCriteria || typeof filterCriteria !== 'object') {
          return {
            accountTypes,
            balanceMin: currentBalanceMin,
            balanceMax: currentBalanceMax,
          };
        }

        // Get the nested filters object
        const filters = (filterCriteria.filters as FilterStructure) || {};

        // Extract account types from filters.type.in
        if (filters.type && typeof filters.type === 'object') {
          const typeFilter = filters.type as TypeCondition;
          if (typeFilter.in && Array.isArray(typeFilter.in)) {
            accountTypes = typeFilter.in.filter(
              (type) =>
                typeof type === 'string' &&
                ACCOUNT_TYPE_OPTIONS.some((option) => option.value === type),
            ) as string[];
          }
        }

        // Fallback: Extract account types from top level "types" field (for backward compatibility)
        if (
          accountTypes.length === 0 &&
          filterCriteria.types &&
          Array.isArray(filterCriteria.types)
        ) {
          accountTypes = filterCriteria.types.filter(
            (type) =>
              typeof type === 'string' &&
              ACCOUNT_TYPE_OPTIONS.some((option) => option.value === type),
          ) as string[];
        }

        // Handle AND array structure for balance (now baseAmount)
        if (Array.isArray(filters.AND)) {
          filters.AND.forEach((condition: FilterAndCondition) => {
            // Handle baseAmount conditions
            if (condition.baseAmount) {
              if (condition.baseAmount.gte !== undefined) {
                // Convert from base currency to selected currency for display
                const convertedMin = getExchangeAmount({
                  amount: condition.baseAmount.gte,
                  fromCurrency: baseCurrency,
                  toCurrency: selectedCurrency,
                });
                currentBalanceMin = convertedMin.convertedAmount;
              }
              if (condition.baseAmount.lte !== undefined) {
                // Convert from base currency to selected currency for display
                const convertedMax = getExchangeAmount({
                  amount: condition.baseAmount.lte,
                  fromCurrency: baseCurrency,
                  toCurrency: selectedCurrency,
                });
                currentBalanceMax = convertedMax.convertedAmount;
              }
            }
          });
        }

        // Fallback: Extract balance range from old structure (for backward compatibility)
        if (filters.balance && typeof filters.balance === 'object') {
          const balanceFilter = filters.balance as RangeCondition;
          if (typeof balanceFilter.gte === 'number') currentBalanceMin = balanceFilter.gte;
          if (typeof balanceFilter.lte === 'number') currentBalanceMax = balanceFilter.lte;
        }

        const result = {
          accountTypes,
          balanceMin: currentBalanceMin,
          balanceMax: currentBalanceMax,
        };

        return result;
      } catch (error) {
        toast.error('Error extracting filter data: ' + JSON.stringify(error));
        return {
          accountTypes: [],
          balanceMin: accountStatistics.minBalance,
          balanceMax: accountStatistics.maxBalance,
        };
      }
    },
    [accountStatistics, baseCurrency, selectedCurrency, getExchangeAmount],
  );

  // Debug function to validate and log filter criteria structure
  const debugFilterCriteria = useCallback((criteria: any) => {
    if (!criteria) {
      toast.error('No filter criteria provided');
      return false;
    }

    const hasData = Boolean(
      (criteria.types && criteria.types.length > 0) ||
        (criteria.filters && Object.keys(criteria.filters).length > 0),
    );

    return hasData;
  }, []);

  // Check if filter criteria is reset to default (empty filters)
  const isFilterCriteriaReset = useCallback((criteria: FilterCriteria) => {
    if (!criteria.filters || Object.keys(criteria.filters).length === 0) {
      return true;
    }

    // Check if any meaningful filters exist
    const filters = criteria.filters as Record<string, unknown>;
    const hasTypes =
      filters.type &&
      typeof filters.type === 'object' &&
      (filters.type as TypeCondition).in &&
      Array.isArray((filters.type as TypeCondition).in) &&
      ((filters.type as TypeCondition).in as string[]).length > 0;

    const hasOtherFilters = Object.keys(filters).some(
      (key) => key !== 'type' && filters[key] !== undefined,
    );

    return !hasTypes && !hasOtherFilters;
  }, []);

  // Initialize filter params with calculated values and existing filter criteria
  useEffect(() => {
    if (!isInitialized && accountStatistics) {
      // Check if filter criteria has been reset to default
      const isReset = isFilterCriteriaReset(filterCriteria);

      if (isReset) {
        // Reset to default values with calculated statistics
        const defaultParams = {
          ...filterParamsInitState,
          balanceMin: accountStatistics.minBalance,
          balanceMax: accountStatistics.maxBalance,
        };

        setFilterParams(defaultParams);
      } else {
        // Check if there are existing filter criteria to read
        const hasExistingCriteria = debugFilterCriteria(filterCriteria);

        if (hasExistingCriteria) {
          // Extract data from existing filter criteria
          const extractedData = extractFilterData(
            filterCriteria as unknown as Record<string, unknown>,
          );

          const finalParams = {
            ...extractedData,
            // Ensure min/max values are set to calculated values if not present in criteria
            balanceMin: extractedData.balanceMin ?? accountStatistics.minBalance,
            balanceMax: extractedData.balanceMax ?? accountStatistics.maxBalance,
          };

          setFilterParams(finalParams);
        } else {
          // No existing criteria, use default values with calculated statistics
          const defaultParams = {
            ...filterParamsInitState,
            balanceMin: accountStatistics.minBalance,
            balanceMax: accountStatistics.maxBalance,
          };

          setFilterParams(defaultParams);
        }
      }

      setIsInitialized(true);
    }
  }, [
    accountStatistics,
    filterCriteria,
    extractFilterData,
    isInitialized,
    debugFilterCriteria,
    isFilterCriteriaReset,
  ]);

  // Reset initialization flag when filter criteria changes externally
  useEffect(() => {
    setIsInitialized(false);
  }, [filterCriteria]);

  // Handler for filter edits
  const handleEditFilter = (target: keyof AccountFilterParams, value: string[] | number) => {
    setFilterParams((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  // Create filter components
  const filterComponents = useMemo(() => {
    // Account type multi-select filter
    const accountTypeFilterComponent = (
      <MultiSelectFilter
        options={ACCOUNT_TYPE_OPTIONS}
        selectedValues={filterParams.accountTypes}
        onChange={(values) => handleEditFilter('accountTypes', values)}
        label="Account Type"
        placeholder="Select account types"
      />
    );

    // Balance range filter with currency formatting
    const balanceFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.balanceMin}
        maxValue={filterParams.balanceMax}
        minRange={accountStatistics.minBalance}
        maxRange={accountStatistics.maxBalance}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'balanceMin' : 'balanceMax', value)
        }
        label={`Balance Range (${selectedCurrency})`}
        minLabel="Min Balance"
        maxLabel="Max Balance"
        step={DEFAULT_SLIDER_STEP}
      />
    );

    return [
      {
        key: 'accountTypeFilter',
        component: accountTypeFilterComponent,
        column: FilterColumn.LEFT,
        order: 0,
      },
      {
        key: 'balanceFilter',
        component: balanceFilterComponent,
        column: FilterColumn.LEFT,
        order: 0,
      },
    ];
  }, [filterParams, accountStatistics]);

  // Create filter structure from UI state
  const createFilterStructure = useCallback(
    (params: AccountFilterParams): Record<string, unknown> => {
      const result: Record<string, unknown> = {};

      // Add account type filter as filters.type.in - only if types are selected
      if (params.accountTypes.length > 0) {
        result.type = {
          in: params.accountTypes,
        };
      }

      // Check if balance values differ from defaults
      const isBalanceDefault =
        params.balanceMin === accountStatistics.minBalance &&
        params.balanceMax === accountStatistics.maxBalance;

      // Only add balance filter if different from default
      if (!isBalanceDefault) {
        // Convert balance range to base currency for storage
        const minBalanceInBaseCurrency = getExchangeAmount({
          amount: params.balanceMin,
          fromCurrency: selectedCurrency,
          toCurrency: baseCurrency,
        });

        const maxBalanceInBaseCurrency = getExchangeAmount({
          amount: params.balanceMax,
          fromCurrency: selectedCurrency,
          toCurrency: baseCurrency,
        });

        // Create AND structure with baseAmount and baseCurrency
        result.AND = [
          {
            baseAmount: {
              gte: minBalanceInBaseCurrency.convertedAmount,
              lte: maxBalanceInBaseCurrency.convertedAmount,
            },
          },
          {
            baseCurrency: baseCurrency,
          },
        ];
      }

      // Return the flat structure - GlobalFilter will wrap it in filters
      return result;
    },
    [accountStatistics, baseCurrency, selectedCurrency, getExchangeAmount],
  );

  // Handler to fetch filtered data
  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      // Create the filter structure that matches the new format
      const structuredFilter: any = {
        userId: newFilter.userId || userId,
        filters: newFilter.filters || {},
      };

      // Save filter criteria to Redux state
      dispatch(setFilterCriteria(structuredFilter));

      // Update filter criteria with structured format
      onFilterChange(structuredFilter);

      // Fetch filtered data with the structured format
      if (userId) {
        dispatch(searchAccounts(structuredFilter));
      }
    },
    [dispatch, onFilterChange, userId],
  );

  return (
    <GlobalFilter
      filterParams={filterParams as unknown as Record<string, unknown>}
      filterComponents={filterComponents}
      onFilterChange={(newFilter) => {
        handleFilterChange(newFilter);
      }}
      defaultFilterCriteria={DEFAULT_ACCOUNT_FILTER_CRITERIA}
      structureCreator={(params: Record<string, unknown>) =>
        createFilterStructure(params as unknown as AccountFilterParams)
      }
      currentFilter={filterCriteria.filters}
    />
  );
};

export default FilterMenu;
