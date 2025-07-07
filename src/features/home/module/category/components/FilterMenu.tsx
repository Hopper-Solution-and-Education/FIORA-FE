/* eslint-disable react-hooks/exhaustive-deps */
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { GlobalFilters } from '@/shared/types';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { setFilterCriteria } from '../slices';
import { searchCategories } from '../slices/actions';

// Define constants for magic numbers
const DEFAULT_MAX_AMOUNT = 100000;
const DEFAULT_LARGE_MAX_VALUE = 1000000;
const DEFAULT_SLIDER_STEP = 1000;

// Default filter criteria for category module
const DEFAULT_CATEGORY_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

interface RangeCondition {
  gte?: number;
  lte?: number;
}

// Local FilterParams interface for category filtering
interface CategoryFilterParams {
  amountMin: number;
  amountMax: number;
}

const filterParamsInitState: CategoryFilterParams = {
  amountMin: 0,
  amountMax: DEFAULT_MAX_AMOUNT,
};

interface FilterMenuProps {
  onFilterChange: (newFilter: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
}

const FilterMenu = ({ onFilterChange, filterCriteria }: FilterMenuProps) => {
  // Get min/max values from Redux state (calculated by the API)
  const { minBalance, maxBalance } = useAppSelector((state) => state.category);
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const dispatch = useAppDispatch();

  // State for filter parameters
  const [filterParams, setFilterParams] = useState<CategoryFilterParams>(filterParamsInitState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate min/max values from category data
  const categoryStatistics = useMemo(() => {
    // Use the min/max values from the Redux state (calculated by the API)
    return {
      minAmount: minBalance || 0,
      maxAmount: maxBalance || DEFAULT_MAX_AMOUNT,
    };
  }, [minBalance, maxBalance]);

  // Extract filter data from filters object
  const extractFilterData = useCallback(
    (filterCriteria: Record<string, unknown>) => {
      try {
        // Initialize with default values
        let currentAmountMin = categoryStatistics.minAmount;
        let currentAmountMax = categoryStatistics.maxAmount;

        // Validate input
        if (!filterCriteria || typeof filterCriteria !== 'object') {
          return {
            amountMin: currentAmountMin,
            amountMax: currentAmountMax,
          };
        }

        // Get the nested filters object
        const filters = (filterCriteria.filters as Record<string, unknown>) || {};

        // Extract amount from transactions
        if (filters.transactions && typeof filters.transactions === 'object') {
          const transactionsFilter = filters.transactions as { some?: { OR?: any[] } };
          if (transactionsFilter.some?.OR && Array.isArray(transactionsFilter.some.OR)) {
            // Look for the first OR condition that has an amount (both Income and Expense should have the same range)
            const firstConditionWithAmount = transactionsFilter.some.OR.find((orCondition) => {
              return orCondition && typeof orCondition === 'object' && orCondition.amount;
            });

            if (firstConditionWithAmount && firstConditionWithAmount.amount) {
              const amount = firstConditionWithAmount.amount as RangeCondition;
              if (typeof amount.gte === 'number') currentAmountMin = amount.gte;
              if (typeof amount.lte === 'number') currentAmountMax = amount.lte;
            }
          }
        }

        const result = {
          amountMin: currentAmountMin,
          amountMax: currentAmountMax,
        };

        return result;
      } catch (error) {
        toast.error('Error extracting filter data:' + JSON.stringify(error));
        return {
          amountMin: categoryStatistics.minAmount,
          amountMax: categoryStatistics.maxAmount,
        };
      }
    },
    [categoryStatistics],
  );

  // Check if filter criteria is reset to default (empty filters)
  const isFilterCriteriaReset = useCallback((criteria: FilterCriteria) => {
    return !criteria.filters || Object.keys(criteria.filters).length === 0;
  }, []);

  // Debug function to validate and log filter criteria structure
  const debugFilterCriteria = useCallback((criteria: any) => {
    if (!criteria) {
      return false;
    }

    const hasData = Boolean(criteria.filters && Object.keys(criteria.filters).length > 0);

    return hasData;
  }, []);

  // Initialize filter params with calculated values and existing filter criteria
  useEffect(() => {
    if (!isInitialized && categoryStatistics) {
      // Check if filter criteria has been reset to default
      const isReset = isFilterCriteriaReset(filterCriteria);

      if (isReset) {
        // Reset to default values with calculated statistics
        const defaultParams = {
          ...filterParamsInitState,
          amountMin: categoryStatistics.minAmount,
          amountMax: categoryStatistics.maxAmount,
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
            amountMin: extractedData.amountMin ?? categoryStatistics.minAmount,
            amountMax: extractedData.amountMax ?? categoryStatistics.maxAmount,
          };

          setFilterParams(finalParams);
        } else {
          // No existing criteria, use default values with calculated statistics
          const defaultParams = {
            ...filterParamsInitState,
            amountMin: categoryStatistics.minAmount,
            amountMax: categoryStatistics.maxAmount,
          };

          setFilterParams(defaultParams);
        }
      }

      setIsInitialized(true);
    }
  }, [
    categoryStatistics,
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

  // Handle external filter criteria changes (including resets)
  useEffect(() => {
    if (categoryStatistics) {
      const isReset = isFilterCriteriaReset(filterCriteria);

      if (isReset) {
        // Reset to default values immediately when filter is cleared
        const defaultParams = {
          ...filterParamsInitState,
          amountMin: categoryStatistics.minAmount,
          amountMax: categoryStatistics.maxAmount,
        };

        setFilterParams(defaultParams);
        setIsInitialized(true);
      }
    }
  }, [filterCriteria, categoryStatistics, isFilterCriteriaReset]);

  // Handler for filter edits
  const handleEditFilter = (target: keyof CategoryFilterParams, value: number) => {
    setFilterParams((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  // Create filter components
  const filterComponents = useMemo(() => {
    // Amount range filter with currency formatting
    const amountFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.amountMin}
        maxValue={filterParams.amountMax}
        minRange={categoryStatistics.minAmount}
        maxRange={categoryStatistics.maxAmount || DEFAULT_LARGE_MAX_VALUE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'amountMin' : 'amountMax', value)
        }
        label="Amount Range"
        minLabel="Min Amount"
        maxLabel="Max Amount"
        step={DEFAULT_SLIDER_STEP}
      />
    );

    return [
      {
        key: 'amountFilter',
        component: amountFilterComponent,
        column: FilterColumn.LEFT,
        order: 0,
      },
    ];
  }, [filterParams, categoryStatistics]);

  // Create filter structure from UI state
  const createFilterStructure = useCallback(
    (params: CategoryFilterParams): Record<string, unknown> => {
      const result: Record<string, unknown> = {};

      // Always add transactions filter with both Income and Expense types
      // Apply the same amount range to both types
      result.transactions = {
        some: {
          OR: [
            {
              type: 'Expense',
              amount: {
                gte: params.amountMin,
                lte: params.amountMax,
              },
            },
            {
              type: 'Income',
              amount: {
                gte: params.amountMin,
                lte: params.amountMax,
              },
            },
          ],
        },
      };

      // Return the flat structure - GlobalFilter will wrap it in filters
      return result;
    },
    [categoryStatistics],
  );

  // Handler to fetch filtered data
  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      // Create the GlobalFilters structure that the API expects
      const globalFilters: GlobalFilters = {
        search: 'Expense', // Set search term to "Expense" as required
        filters: newFilter.filters || {},
      };

      // Create FilterCriteria structure for Redux state
      const filterCriteriaForRedux: FilterCriteria = {
        userId: newFilter.userId || userId,
        filters: newFilter.filters || {},
      };

      // Update filter criteria with FilterCriteria structure for Redux
      onFilterChange(filterCriteriaForRedux);

      // Update Redux state with the new filter criteria
      dispatch(setFilterCriteria(filterCriteriaForRedux));

      // Fetch filtered data with the GlobalFilters structure for API
      if (userId) {
        dispatch(searchCategories(globalFilters));
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
      defaultFilterCriteria={DEFAULT_CATEGORY_FILTER_CRITERIA}
      structureCreator={(params: Record<string, unknown>) =>
        createFilterStructure(params as unknown as CategoryFilterParams)
      }
      currentFilter={filterCriteria.filters}
    />
  );
};

export default FilterMenu;
