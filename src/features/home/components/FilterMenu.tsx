import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { getProductTransactionAsyncThunk } from '@/features/setting/module/product/slices/actions';
import { formatCurrency } from '@/shared/lib';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_DASHBOARD_FILTER_CRITERIA } from '../constants';
import { DropdownOption } from '../module/transaction/types';

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
  expenseMax: 0,
  priceMin: 0,
  priceMax: 0,
  taxRateMin: 0,
  taxRateMax: 0,
  incomeMin: 0,
  incomeMax: 0,
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
        priceMax: productTransaction.maxPrice || 0,
        taxRateMin: productTransaction.minTaxRate || 0,
        taxRateMax: productTransaction.maxTaxRate || 0,
        expenseMin: productTransaction.minExpense || 0,
        expenseMax: productTransaction.maxExpense || 0,
        incomeMin: productTransaction.minIncome || 0,
        incomeMax: productTransaction.maxIncome || 0,
      }));
    }
  }, [productTransaction]);

  // Extract filter data from filters object
  const extractFilterData = useCallback(
    (filters: Record<string, unknown>) => {
      // Extract types handling both single type string and 'in' operator format
      let types: string[] = [];
      if (filters.type) {
        if (typeof filters.type === 'string') {
          // Handle single type string format
          types = [filters.type];
        } else if (typeof filters.type === 'object') {
          // Handle 'in' operator format
          const typeFilter = filters.type as { in?: string[] };
          types = typeFilter.in || [];
        }
      }

      // Extract price range
      let currentPriceMin = productTransaction.minPrice || 0;
      let currentPriceMax = productTransaction.maxPrice || 0;
      if (filters.price && typeof filters.price === 'object') {
        const priceFilter = filters.price as RangeCondition;
        if (priceFilter.gte !== undefined) currentPriceMin = priceFilter.gte;
        if (priceFilter.lte !== undefined) currentPriceMax = priceFilter.lte;
      }

      // Extract tax rate
      let currentTaxRateMin = productTransaction.minTaxRate || 0;
      let currentTaxRateMax = productTransaction.maxTaxRate || 0;
      if (filters.taxRate && typeof filters.taxRate === 'object') {
        const taxRateFilter = filters.taxRate as RangeCondition;
        // Convert from decimal to percentage for display
        if (taxRateFilter.gte !== undefined) currentTaxRateMin = taxRateFilter.gte * 100;
        if (taxRateFilter.lte !== undefined) currentTaxRateMax = taxRateFilter.lte * 100;
      }

      // Extract expense and income from transactions
      let currentExpenseMin = productTransaction.minExpense || 0;
      let currentExpenseMax = productTransaction.maxExpense || 0;
      let currentIncomeMin = productTransaction.minIncome || 0;
      let currentIncomeMax = productTransaction.maxIncome || 0;

      if (filters.transactions && typeof filters.transactions === 'object') {
        const transactionsFilter = filters.transactions as { some?: { OR?: any[] } };
        if (transactionsFilter.some?.OR) {
          // Process each transaction type
          transactionsFilter.some.OR.forEach((orCondition) => {
            if (orCondition.transaction) {
              if (orCondition.transaction.type === 'Expense' && orCondition.transaction.amount) {
                const amount = orCondition.transaction.amount as RangeCondition;
                if (amount.gte !== undefined) currentExpenseMin = amount.gte;
                if (amount.lte !== undefined) currentExpenseMax = amount.lte;
              }
              if (orCondition.transaction.type === 'Income' && orCondition.transaction.amount) {
                const amount = orCondition.transaction.amount as RangeCondition;
                if (amount.gte !== undefined) currentIncomeMin = amount.gte;
                if (amount.lte !== undefined) currentIncomeMax = amount.lte;
              }
            }
          });
        }
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
    const extractedData = extractFilterData(filterCriteria.filters as Record<string, unknown>);
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
        maxRange={productTransaction.maxExpense || 0}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'expenseMin' : 'expenseMax', value)
        }
        label="Expense Range"
        minLabel="Min Expense"
        maxLabel="Max Expense"
        formatValue={(value, isEditing) => (isEditing ? value : formatCurrency(value))}
        tooltipFormat={(value) => formatCurrency(value)}
        step={DEFAULT_SLIDER_STEP}
      />
    );

    // Price range filter with currency formatting
    const priceFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.priceMin}
        maxValue={filterParams.priceMax}
        minRange={productTransaction.minPrice || 0}
        maxRange={productTransaction.maxPrice || 0}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'priceMin' : 'priceMax', value)
        }
        label="Price Range"
        minLabel="Min Price"
        maxLabel="Max Price"
        formatValue={(value, isEditing) => (isEditing ? value : formatCurrency(value))}
        tooltipFormat={(value) => formatCurrency(value)}
        step={DEFAULT_SLIDER_STEP}
      />
    );

    // Tax rate range filter
    const taxRateFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.taxRateMin}
        maxValue={filterParams.taxRateMax}
        minRange={productTransaction.minTaxRate || 0}
        maxRange={productTransaction.maxTaxRate || 0}
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
        maxRange={productTransaction.maxIncome || 0}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'incomeMin' : 'incomeMax', value)
        }
        label="Income Range"
        minLabel="Min Income"
        maxLabel="Max Income"
        formatValue={(value, isEditing) => (isEditing ? value : formatCurrency(value))}
        tooltipFormat={(value) => formatCurrency(value)}
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

  // Create filter structure from UI state
  const createFilterStructure = useCallback(
    (params: ExtendedFilterParams): Record<string, unknown> => {
      const updatedFilters: Record<string, unknown> = {};

      // Add type filter if selected using the new 'in' operator format
      if (params.types.length > 1) {
        updatedFilters.type = {
          in: params.types,
        };
      } else if (params.types.length === 1) {
        updatedFilters.type = params.types[0];
      }

      // Add price range filter only if different from default values
      const isPriceDefault =
        params.priceMin === (productTransaction.minPrice || 0) &&
        params.priceMax === (productTransaction.maxPrice || 0);

      if (!isPriceDefault) {
        updatedFilters.price = {
          gte: params.priceMin,
          lte: params.priceMax,
        };
      }

      // Add tax rate filter only if different from default values
      const isTaxRateDefault =
        params.taxRateMin === (productTransaction.minTaxRate || 0) &&
        params.taxRateMax === (productTransaction.maxTaxRate || 0);

      if (!isTaxRateDefault) {
        updatedFilters.taxRate = {
          gte: params.taxRateMin / 100, // Convert from percentage to decimal
          lte: params.taxRateMax / 100, // Convert from percentage to decimal
        };
      }

      // Check if expense and income values differ from defaults
      const isExpenseDefault =
        params.expenseMin === (productTransaction.minExpense || 0) &&
        params.expenseMax === (productTransaction.maxExpense || 0);

      const isIncomeDefault =
        params.incomeMin === (productTransaction.minIncome || 0) &&
        params.incomeMax === (productTransaction.maxIncome || 0);

      // Only add transactions filter if either expense or income ranges differ from defaults
      if (!isExpenseDefault || !isIncomeDefault) {
        const transactionConditions = [];

        // Add expense filter if different from default
        if (!isExpenseDefault) {
          transactionConditions.push({
            transaction: {
              type: 'Expense',
              amount: {
                gte: params.expenseMin,
                lte: params.expenseMax,
              },
            },
          });
        }

        // Add income filter if different from default
        if (!isIncomeDefault) {
          transactionConditions.push({
            transaction: {
              type: 'Income',
              amount: {
                gte: params.incomeMin,
                lte: params.incomeMax,
              },
            },
          });
        }

        // Only add transactions filter if we have conditions to apply
        if (transactionConditions.length > 0) {
          updatedFilters.transactions = {
            some: {
              OR: transactionConditions,
            },
          };
        }
      }

      return updatedFilters;
    },
    [productTransaction],
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
            page: 1,
            pageSize: productTransaction.pageSize || DEFAULT_PAGE_SIZE,
            filters: newFilter.filters,
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
      onFilterChange={(newFilter) => {
        handleFilterChange(newFilter);
      }}
      defaultFilterCriteria={DEFAULT_DASHBOARD_FILTER_CRITERIA}
      structureCreator={(params: Record<string, unknown>) =>
        createFilterStructure(params as unknown as ExtendedFilterParams)
      }
    />
  );
};

export default FilterMenu;
