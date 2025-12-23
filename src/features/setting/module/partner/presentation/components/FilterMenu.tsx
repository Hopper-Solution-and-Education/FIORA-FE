import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { useCurrencyFormatter } from '@/shared/hooks';
import { FilterColumn, FilterCriteria } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { searchPartners } from '../../slices/actions/searchPartnersAsyncThunk';

// Define constants for magic numbers
const DEFAULT_MAX_EXPENSE = 100000;
const DEFAULT_MAX_INCOME = 100000;
const DEFAULT_LARGE_MAX_VALUE = 1000000;
const DEFAULT_SLIDER_STEP = 1000;

// Fixed partner type options
const PARTNER_TYPE_OPTIONS = [
  { value: 'Customer', label: 'Customer' },
  { value: 'Supplier', label: 'Supplier' },
];

// Default filter criteria for partner module
const DEFAULT_PARTNER_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

interface RangeCondition {
  gte?: number;
  lte?: number;
}

interface DateCondition {
  gte?: string;
  lte?: string;
}

// Local FilterParams interface for partner filtering
interface PartnerFilterParams {
  partnerTypes: string[];
  expenseMin: number;
  expenseMax: number;
  incomeMin: number;
  incomeMax: number;
  dobRange?: DateRange;
}

const filterParamsInitState: PartnerFilterParams = {
  partnerTypes: [],
  expenseMin: 0,
  expenseMax: DEFAULT_MAX_EXPENSE,
  incomeMin: 0,
  incomeMax: DEFAULT_MAX_INCOME,
  dobRange: undefined,
};

interface FilterMenuProps {
  onFilterChange: (newFilter: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
}

const FilterMenu = ({ onFilterChange, filterCriteria }: FilterMenuProps) => {
  // Get min/max values from Redux state (calculated by the API)
  const { minIncome, maxIncome, minExpense, maxExpense } = useAppSelector((state) => state.partner);
  const { currency: selectedCurrency, baseCurrency } = useAppSelector((state) => state.settings);
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const dispatch = useAppDispatch();
  const { getExchangeAmount } = useCurrencyFormatter();

  // State for filter parameters
  const [filterParams, setFilterParams] = useState<PartnerFilterParams>(filterParamsInitState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate min/max values from partner data
  const partnerStatistics = useMemo(() => {
    // Use the min/max values from the Redux state (calculated by the API)
    return {
      minExpense: minExpense || 0,
      maxExpense: maxExpense || DEFAULT_MAX_EXPENSE,
      minIncome: minIncome || 0,
      maxIncome: maxIncome || DEFAULT_MAX_INCOME,
    };
  }, [minIncome, maxIncome, minExpense, maxExpense]);

  // Extract filter data from filters object
  const extractFilterData = useCallback(
    (filterCriteria: Record<string, unknown>) => {
      try {
        // Initialize with default values
        let partnerTypes: string[] = [];
        let dobRange: DateRange | undefined;
        let currentExpenseMin = partnerStatistics.minExpense;
        let currentExpenseMax = partnerStatistics.maxExpense;
        let currentIncomeMin = partnerStatistics.minIncome;
        let currentIncomeMax = partnerStatistics.maxIncome;

        // Validate input
        if (!filterCriteria || typeof filterCriteria !== 'object') {
          return {
            partnerTypes,
            expenseMin: currentExpenseMin,
            expenseMax: currentExpenseMax,
            incomeMin: currentIncomeMin,
            incomeMax: currentIncomeMax,
            dobRange,
          };
        }

        // Extract partner types from top level "types" field
        if (filterCriteria.types && Array.isArray(filterCriteria.types)) {
          partnerTypes = filterCriteria.types.filter(
            (type) =>
              typeof type === 'string' &&
              PARTNER_TYPE_OPTIONS.some((option) => option.value === type),
          ) as string[];
        }

        // Get the nested filters object
        const filters = (filterCriteria.filters as Record<string, unknown>) || {};

        // Extract DOB range
        if (filters.dob && typeof filters.dob === 'object') {
          const dobFilter = filters.dob as DateCondition;
          if (dobFilter.gte || dobFilter.lte) {
            dobRange = {
              from: dobFilter.gte ? new Date(dobFilter.gte) : undefined,
              to: dobFilter.lte ? new Date(dobFilter.lte) : undefined,
            };
          }
        }

        // Extract expense and income from transactions
        if (filters.transactions && typeof filters.transactions === 'object') {
          const transactionsFilter = filters.transactions as { some?: { OR?: any[] } };
          if (transactionsFilter.some?.OR && Array.isArray(transactionsFilter.some.OR)) {
            transactionsFilter.some.OR.forEach((orCondition) => {
              if (orCondition && typeof orCondition === 'object') {
                // Handle new structure with AND conditions for baseAmount and baseCurrency
                if (
                  orCondition.type === 'Expense' &&
                  orCondition.AND &&
                  Array.isArray(orCondition.AND)
                ) {
                  orCondition.AND.forEach((andCondition: any) => {
                    if (andCondition.baseAmount) {
                      const baseAmount = andCondition.baseAmount as RangeCondition;
                      if (typeof baseAmount.gte === 'number') {
                        // Convert from base currency to selected currency for display
                        const convertedMin = getExchangeAmount({
                          amount: baseAmount.gte,
                          fromCurrency: baseCurrency,
                          toCurrency: selectedCurrency,
                        });
                        currentExpenseMin = convertedMin.convertedAmount;
                      }
                      if (typeof baseAmount.lte === 'number') {
                        // Convert from base currency to selected currency for display
                        const convertedMax = getExchangeAmount({
                          amount: baseAmount.lte,
                          fromCurrency: baseCurrency,
                          toCurrency: selectedCurrency,
                        });
                        currentExpenseMax = convertedMax.convertedAmount;
                      }
                    }
                  });
                }
                if (
                  orCondition.type === 'Income' &&
                  orCondition.AND &&
                  Array.isArray(orCondition.AND)
                ) {
                  orCondition.AND.forEach((andCondition: any) => {
                    if (andCondition.baseAmount) {
                      const baseAmount = andCondition.baseAmount as RangeCondition;
                      if (typeof baseAmount.gte === 'number') {
                        // Convert from base currency to selected currency for display
                        const convertedMin = getExchangeAmount({
                          amount: baseAmount.gte,
                          fromCurrency: baseCurrency,
                          toCurrency: selectedCurrency,
                        });
                        currentIncomeMin = convertedMin.convertedAmount;
                      }
                      if (typeof baseAmount.lte === 'number') {
                        // Convert from base currency to selected currency for display
                        const convertedMax = getExchangeAmount({
                          amount: baseAmount.lte,
                          fromCurrency: baseCurrency,
                          toCurrency: selectedCurrency,
                        });
                        currentIncomeMax = convertedMax.convertedAmount;
                      }
                    }
                  });
                }
                // Fallback to old structure for backward compatibility
                if (orCondition.type === 'Expense' && orCondition.amount) {
                  const amount = orCondition.amount as RangeCondition;
                  if (typeof amount.gte === 'number') currentExpenseMin = amount.gte;
                  if (typeof amount.lte === 'number') currentExpenseMax = amount.lte;
                }
                if (orCondition.type === 'Income' && orCondition.amount) {
                  const amount = orCondition.amount as RangeCondition;
                  if (typeof amount.gte === 'number') currentIncomeMin = amount.gte;
                  if (typeof amount.lte === 'number') currentIncomeMax = amount.lte;
                }
              }
            });
          }
        }

        const result = {
          partnerTypes,
          expenseMin: currentExpenseMin,
          expenseMax: currentExpenseMax,
          incomeMin: currentIncomeMin,
          incomeMax: currentIncomeMax,
          dobRange,
        };

        return result;
      } catch (error) {
        toast.error('Error extracting filter data:' + JSON.stringify(error));
        return {
          partnerTypes: [],
          expenseMin: partnerStatistics.minExpense,
          expenseMax: partnerStatistics.maxExpense,
          incomeMin: partnerStatistics.minIncome,
          incomeMax: partnerStatistics.maxIncome,
          dobRange: undefined,
        };
      }
    },
    [partnerStatistics, baseCurrency, selectedCurrency, getExchangeAmount],
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

  // Initialize filter params with calculated values and existing filter criteria
  useEffect(() => {
    if (!isInitialized && partnerStatistics) {
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
          expenseMin: extractedData.expenseMin ?? partnerStatistics.minExpense,
          expenseMax: extractedData.expenseMax ?? partnerStatistics.maxExpense,
          incomeMin: extractedData.incomeMin ?? partnerStatistics.minIncome,
          incomeMax: extractedData.incomeMax ?? partnerStatistics.maxIncome,
        };

        setFilterParams(finalParams);
      } else {
        // No existing criteria, use default values with calculated statistics
        const defaultParams = {
          ...filterParamsInitState,
          expenseMin: partnerStatistics.minExpense,
          expenseMax: partnerStatistics.maxExpense,
          incomeMin: partnerStatistics.minIncome,
          incomeMax: partnerStatistics.maxIncome,
        };

        setFilterParams(defaultParams);
      }

      setIsInitialized(true);
    }
  }, [partnerStatistics, filterCriteria, extractFilterData, isInitialized, debugFilterCriteria]);

  // Reset initialization flag when filter criteria changes externally
  useEffect(() => {
    setIsInitialized(false);
  }, [filterCriteria]);

  // Handler for filter edits
  const handleEditFilter = (
    target: keyof PartnerFilterParams,
    value: string[] | number | DateRange | undefined,
  ) => {
    setFilterParams((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  // Create filter components
  const filterComponents = useMemo(() => {
    // Partner type multi-select filter
    const partnerTypeFilterComponent = (
      <MultiSelectFilter
        options={PARTNER_TYPE_OPTIONS}
        selectedValues={filterParams.partnerTypes}
        onChange={(values) => handleEditFilter('partnerTypes', values)}
        label="Partner Type"
        placeholder="Select partner types"
      />
    );

    // Expense range filter with currency formatting
    const expenseFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.expenseMin}
        maxValue={filterParams.expenseMax}
        minRange={partnerStatistics.minExpense}
        maxRange={partnerStatistics.maxExpense || DEFAULT_LARGE_MAX_VALUE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'expenseMin' : 'expenseMax', value)
        }
        label={`Expense Range (${selectedCurrency})`}
        minLabel="Min Expense"
        maxLabel="Max Expense"
        step={DEFAULT_SLIDER_STEP}
      />
    );

    // Income range filter with currency formatting
    const incomeFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.incomeMin}
        maxValue={filterParams.incomeMax}
        minRange={partnerStatistics.minIncome}
        maxRange={partnerStatistics.maxIncome || DEFAULT_LARGE_MAX_VALUE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'incomeMin' : 'incomeMax', value)
        }
        label={`Income Range (${selectedCurrency})`}
        minLabel="Min Income"
        maxLabel="Max Income"
        step={DEFAULT_SLIDER_STEP}
      />
    );

    // DOB date range filter
    const dobFilterComponent = (
      <DateRangeFilter
        dateRange={filterParams.dobRange}
        onChange={(values) => handleEditFilter('dobRange', values)}
        label="Date of Birth Range"
        colorScheme="default"
        disableFuture={true}
        pastDaysLimit={36500} // About 100 years
      />
    );

    return [
      {
        key: 'partnerTypeFilter',
        component: partnerTypeFilterComponent,
        column: FilterColumn.LEFT,
        order: 0,
      },
      {
        key: 'expenseFilter',
        component: expenseFilterComponent,
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'incomeFilter',
        component: incomeFilterComponent,
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'dobFilter',
        component: dobFilterComponent,
        column: FilterColumn.RIGHT,
        order: 1,
      },
    ];
  }, [filterParams, partnerStatistics, selectedCurrency]);

  // Create filter structure from UI state
  const createFilterStructure = useCallback(
    (params: PartnerFilterParams): Record<string, unknown> => {
      const result: Record<string, unknown> = {};

      // Add partner type filter at top level as "types" - only if types are selected
      if (params.partnerTypes.length > 0) {
        result.types = params.partnerTypes;
      }

      // Add DOB range filter directly - only if a date range is selected
      if (params.dobRange?.from || params.dobRange?.to) {
        const dobFilter: DateCondition = {};
        if (params.dobRange.from) {
          dobFilter.gte = params.dobRange.from.toISOString().split('T')[0];
        }
        if (params.dobRange.to) {
          dobFilter.lte = params.dobRange.to.toISOString().split('T')[0];
        }
        result.dob = dobFilter;
      }

      // Check if expense and income values differ from defaults
      const isExpenseDefault =
        params.expenseMin === partnerStatistics.minExpense &&
        params.expenseMax === partnerStatistics.maxExpense;

      const isIncomeDefault =
        params.incomeMin === partnerStatistics.minIncome &&
        params.incomeMax === partnerStatistics.maxIncome;

      // Only add transactions filter if either expense or income ranges differ from defaults
      if (!isExpenseDefault || !isIncomeDefault) {
        const transactionConditions = [];

        // Add expense filter if different from default
        if (!isExpenseDefault) {
          // Convert amounts from selected currency to base currency
          const minAmountInBaseCurrency = getExchangeAmount({
            amount: params.expenseMin,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          const maxAmountInBaseCurrency = getExchangeAmount({
            amount: params.expenseMax,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          transactionConditions.push({
            type: 'Expense',
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
        }

        // Add income filter if different from default
        if (!isIncomeDefault) {
          // Convert amounts from selected currency to base currency
          const minAmountInBaseCurrency = getExchangeAmount({
            amount: params.incomeMin,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          const maxAmountInBaseCurrency = getExchangeAmount({
            amount: params.incomeMax,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          transactionConditions.push({
            type: 'Income',
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
        }

        // Only add transactions filter if we have conditions to apply
        if (transactionConditions.length > 0) {
          result.transactions = {
            some: {
              OR: transactionConditions,
            },
          };
        }
      }

      // Return the flat structure - GlobalFilter will wrap it in filters
      return result;
    },
    [partnerStatistics, baseCurrency, selectedCurrency, getExchangeAmount],
  );

  // Handler to fetch filtered data
  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      // Extract types from the nested structure and create flat structure
      const flattenedFilter: any = {
        userId: newFilter.userId || userId,
      };

      // Check if filters exist and extract types from them
      if (newFilter.filters && typeof newFilter.filters === 'object') {
        const filters = newFilter.filters as Record<string, unknown>;

        // Extract types from filters and place at top level
        if (filters.types && Array.isArray(filters.types)) {
          flattenedFilter.types = filters.types;
        }

        // Create new filters object without the types field
        const otherFilters = { ...filters };
        delete otherFilters.types;

        // Only add filters object if there are other filters besides types
        if (Object.keys(otherFilters).length > 0) {
          flattenedFilter.filters = otherFilters;
        } else {
          flattenedFilter.filters = {};
        }
      } else {
        flattenedFilter.filters = {};
      }

      // Update filter criteria with flattened structure
      onFilterChange(flattenedFilter);

      // Fetch filtered data with the flattened structure
      if (userId) {
        dispatch(searchPartners(flattenedFilter));
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
      defaultFilterCriteria={DEFAULT_PARTNER_FILTER_CRITERIA}
      structureCreator={(params: Record<string, unknown>) =>
        createFilterStructure(params as unknown as PartnerFilterParams)
      }
      currentFilter={filterCriteria.filters}
    />
  );
};

export default FilterMenu;
