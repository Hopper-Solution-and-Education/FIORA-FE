import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getProductTransactionAsyncThunk } from '@/features/setting/module/product/slices/actions';
import { useSession } from 'next-auth/react';
import { DropdownOption } from '../module/transaction/types';
import { DEFAULT_DASHBOARD_FILTER_CRITERIA } from '../constants';

// Define constants for magic numbers
const DEFAULT_MAX_EXPENSE = 100000;
const DEFAULT_MAX_PRICE = 100000;
const DEFAULT_MIN_TAX_RATE = 1;
const DEFAULT_MAX_TAX_RATE = 100;
const DEFAULT_MAX_INCOME = 100000;
const DEFAULT_LARGE_MAX_VALUE = 1000000;
const DEFAULT_SLIDER_STEP = 1000;
const DEFAULT_PAGE_SIZE = 10;

// Fixed type options
const TYPE_OPTIONS: DropdownOption[] = [
  { value: 'Product', label: 'Product' },
  { value: 'Service', label: 'Service' },
  { value: 'Edu', label: 'Edu' },
];

interface RangeCondition {
  gte?: number;
  lte?: number;
}

interface ProductCondition {
  name?: string;
  id?: string;
}

interface FilterStructure {
  AND?: FilterCondition[];
}

interface FilterCondition {
  price?: RangeCondition;
  taxRate?: RangeCondition;
  expense?: RangeCondition;
  income?: RangeCondition;
  OR?: ProductCondition[];
}

// Local FilterParams interface to extend the imported one with 'types'
interface ExtendedFilterParams {
  types: string[];
  products?: string[];
  expenseMin: number;
  expenseMax: number;
  priceMin: number;
  priceMax: number;
  taxRateMin: number;
  taxRateMax: number;
  incomeMin: number;
  incomeMax: number;
}

const filterParamsInitState: ExtendedFilterParams = {
  types: [],
  products: [],
  expenseMin: 0,
  expenseMax: DEFAULT_MAX_EXPENSE,
  priceMin: 0,
  priceMax: DEFAULT_MAX_PRICE,
  taxRateMin: DEFAULT_MIN_TAX_RATE,
  taxRateMax: DEFAULT_MAX_TAX_RATE,
  incomeMin: 0,
  incomeMax: DEFAULT_MAX_INCOME,
};

interface FilterMenuProps {
  onFilterChange: (newFilter: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
}

const FilterMenu = ({ onFilterChange, filterCriteria }: FilterMenuProps) => {
  // Get min/max values from Redux state
  const productTransaction = useAppSelector((state) => state.productManagement.productTransaction);
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const dispatch = useAppDispatch();

  // State for filter parameters
  const [filterParams, setFilterParams] = useState<ExtendedFilterParams>(filterParamsInitState);

  // Initialize filter params with values from Redux when they change
  useEffect(() => {
    if (productTransaction) {
      setFilterParams((prev) => ({
        ...prev,
        priceMin: productTransaction.minPrice || 0,
        priceMax: productTransaction.maxPrice || DEFAULT_MAX_PRICE,
        taxRateMin: productTransaction.minTaxRate || DEFAULT_MIN_TAX_RATE,
        taxRateMax: productTransaction.maxTaxRate || DEFAULT_MAX_TAX_RATE,
        expenseMin: productTransaction.minExpense || 0,
        expenseMax: productTransaction.maxExpense || DEFAULT_MAX_EXPENSE,
        incomeMin: productTransaction.minIncome || 0,
        incomeMax: productTransaction.maxIncome || DEFAULT_MAX_INCOME,
      }));
    }
  }, [productTransaction]);

  // Extract filter data from filters object
  const extractFilterData = useCallback(
    (filters: FilterStructure) => {
      const types: string[] = [];
      let currentPriceMin = productTransaction.minPrice || 0;
      let currentPriceMax = productTransaction.maxPrice || DEFAULT_MAX_PRICE;
      let currentTaxRateMin = productTransaction.minTaxRate || DEFAULT_MIN_TAX_RATE;
      let currentTaxRateMax = productTransaction.maxTaxRate || DEFAULT_MAX_TAX_RATE;
      let currentExpenseMin = productTransaction.minExpense || 0;
      let currentExpenseMax = productTransaction.maxExpense || DEFAULT_MAX_EXPENSE;
      let currentIncomeMin = productTransaction.minIncome || 0;
      let currentIncomeMax = productTransaction.maxIncome || DEFAULT_MAX_INCOME;

      // Handle AND array structure
      if (Array.isArray(filters?.AND)) {
        filters.AND.forEach((condition: FilterCondition) => {
          // Handle type ids in OR conditions
          if (Array.isArray(condition.OR)) {
            condition.OR.forEach((orCondition: ProductCondition) => {
              if (orCondition.id) {
                types.push(orCondition.id);
              } else if (orCondition.name) {
                // For backward compatibility
                types.push(orCondition.name);
              }
            });
          }

          // Handle price conditions
          if (condition.price) {
            if (condition.price.gte !== undefined) currentPriceMin = condition.price.gte;
            if (condition.price.lte !== undefined) currentPriceMax = condition.price.lte;
          }

          // Handle tax rate conditions
          if (condition.taxRate) {
            if (condition.taxRate.gte !== undefined) currentTaxRateMin = condition.taxRate.gte;
            if (condition.taxRate.lte !== undefined) currentTaxRateMax = condition.taxRate.lte;
          }

          // Handle expense conditions
          if (condition.expense) {
            if (condition.expense.gte !== undefined) currentExpenseMin = condition.expense.gte;
            if (condition.expense.lte !== undefined) currentExpenseMax = condition.expense.lte;
          }

          // Handle income conditions
          if (condition.income) {
            if (condition.income.gte !== undefined) currentIncomeMin = condition.income.gte;
            if (condition.income.lte !== undefined) currentIncomeMax = condition.income.lte;
          }
        });
      }

      return {
        types,
        priceMin: currentPriceMin,
        priceMax: currentPriceMax,
        taxRateMin: currentTaxRateMin,
        taxRateMax: currentTaxRateMax,
        expenseMin: currentExpenseMin,
        expenseMax: currentExpenseMax,
        incomeMin: currentIncomeMin,
        incomeMax: currentIncomeMax,
      };
    },
    [productTransaction],
  );

  // Sync filter params when filter criteria changes
  useEffect(() => {
    const extractedData = extractFilterData(filterCriteria.filters as FilterStructure);
    setFilterParams((prev) => ({
      ...prev,
      ...extractedData,
    }));
  }, [filterCriteria, extractFilterData]);

  // Handler for filter edits
  const handleEditFilter = (target: keyof ExtendedFilterParams, value: string[] | number) => {
    setFilterParams((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  // Create filter components
  const filterComponents = useMemo(() => {
    // Type multi-select filter with fixed options
    const typeFilterComponent = (
      <MultiSelectFilter
        options={TYPE_OPTIONS}
        selectedValues={filterParams.types}
        onChange={(values) => handleEditFilter('types', values)}
        label="Type"
        placeholder="Select types"
      />
    );

    // Expense range filter with currency formatting
    const expenseFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.expenseMin}
        maxValue={filterParams.expenseMax}
        minRange={productTransaction.minExpense || 0}
        maxRange={productTransaction.maxExpense || DEFAULT_LARGE_MAX_VALUE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'expenseMin' : 'expenseMax', value)
        }
        label="Expense Range"
        minLabel="Min Expense"
        maxLabel="Max Expense"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `$${value.toLocaleString()}`}
        step={DEFAULT_SLIDER_STEP}
      />
    );

    // Price range filter with currency formatting
    const priceFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.priceMin}
        maxValue={filterParams.priceMax}
        minRange={productTransaction.minPrice || 0}
        maxRange={productTransaction.maxPrice || DEFAULT_LARGE_MAX_VALUE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'priceMin' : 'priceMax', value)
        }
        label="Price Range"
        minLabel="Min Price"
        maxLabel="Max Price"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `$${value.toLocaleString()}`}
        step={DEFAULT_SLIDER_STEP}
      />
    );

    // Tax rate range filter
    const taxRateFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.taxRateMin}
        maxValue={filterParams.taxRateMax}
        minRange={productTransaction.minTaxRate || DEFAULT_MIN_TAX_RATE}
        maxRange={productTransaction.maxTaxRate || DEFAULT_MAX_TAX_RATE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'taxRateMin' : 'taxRateMax', value)
        }
        label="Tax Rate Range"
        minLabel="Min Rate"
        maxLabel="Max Rate"
        formatValue={(value, isEditing) => (isEditing ? value : `${value}%`)}
        tooltipFormat={(value) => `${value}%`}
        step={1}
      />
    );

    // Income range filter with currency formatting
    const incomeFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.incomeMin}
        maxValue={filterParams.incomeMax}
        minRange={productTransaction.minIncome || 0}
        maxRange={productTransaction.maxIncome || DEFAULT_LARGE_MAX_VALUE}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'incomeMin' : 'incomeMax', value)
        }
        label="Income Range"
        minLabel="Min Income"
        maxLabel="Max Income"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `$${value.toLocaleString()}`}
        step={DEFAULT_SLIDER_STEP}
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
        key: 'expenseFilter',
        component: expenseFilterComponent,
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'priceFilter',
        component: priceFilterComponent,
        column: FilterColumn.LEFT,
        order: 2,
      },
      {
        key: 'taxRateFilter',
        component: taxRateFilterComponent,
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'incomeFilter',
        component: incomeFilterComponent,
        column: FilterColumn.RIGHT,
        order: 1,
      },
    ];
  }, [filterParams, productTransaction]);

  // Build filter structure from the current parameters
  const buildFilters = () => {
    const filters = createFilterStructure(filterParams);
    const filterCriteriaObj: FilterCriteria = {
      userId,
      filters, // FilterCriteria expects filters as Record<string, unknown>
    };
    return filterCriteriaObj;
  };

  // Create filter structure from UI state
  const createFilterStructure = useCallback(
    (params: ExtendedFilterParams): Record<string, unknown> => {
      const updatedFilters: Record<string, unknown> = {};

      // Add type filter if selected
      if (params.types.length > 0) {
        // Use just the first selected type if multiple are selected
        updatedFilters.type = params.types[0];
      }

      // Add price range filter
      updatedFilters.price = {
        gte: params.priceMin,
        lte: params.priceMax,
      };

      // Add tax rate filter
      updatedFilters.taxRate = {
        gte: params.taxRateMin / 100, // Convert from percentage to decimal
        lte: params.taxRateMax / 100, // Convert from percentage to decimal
      };

      // Add transactions filter for expense and income
      updatedFilters.transactions = {
        some: {
          OR: [
            {
              transaction: {
                type: 'Expense',
                amount: {
                  gte: params.expenseMin,
                  lte: params.expenseMax,
                },
              },
            },
            {
              transaction: {
                type: 'Income',
                amount: {
                  gte: params.incomeMin,
                  lte: params.incomeMax,
                },
              },
            },
          ],
        },
      };

      return updatedFilters;
    },
    [],
  );

  // Handler to fetch filtered data
  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      // Update filter criteria in Redux
      onFilterChange(newFilter);

      // Fetch filtered data
      if (userId) {
        dispatch(
          getProductTransactionAsyncThunk({
            page: 1, // Reset to first page when filtering
            pageSize: productTransaction.pageSize || DEFAULT_PAGE_SIZE,
            filters: newFilter, // Pass the complete FilterCriteria object
            userId,
          }),
        );
      }
    },
    [dispatch, onFilterChange, productTransaction.pageSize, userId],
  );

  return (
    <GlobalFilter
      filterParams={filterParams as unknown as Record<string, unknown>}
      filterComponents={filterComponents}
      onFilterChange={() => {
        const filterCriteriaObj = buildFilters();
        handleFilterChange(filterCriteriaObj);
      }}
      defaultFilterCriteria={DEFAULT_DASHBOARD_FILTER_CRITERIA}
      structureCreator={(params: Record<string, unknown>) =>
        createFilterStructure(params as unknown as ExtendedFilterParams)
      }
    />
  );
};

export default FilterMenu;
