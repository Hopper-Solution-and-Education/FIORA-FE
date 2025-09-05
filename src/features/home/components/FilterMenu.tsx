import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { getProductTransactionAsyncThunk } from '@/features/setting/module/product/slices/actions';
import { useCurrencyFormatter } from '@/shared/hooks';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { DropdownOption } from '@/shared/types/transaction.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_DASHBOARD_FILTER_CRITERIA } from '../constants';

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
  const { currency: selectedCurrency, baseCurrency } = useAppSelector((state) => state.settings);
  const { getExchangeAmount } = useCurrencyFormatter();
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const dispatch = useAppDispatch();

  // State for filter parameters
  const [filterParams, setFilterParams] = useState<ExtendedFilterParams>(filterParamsInitState);

  // Initialize filter params with values from Redux when they change
  useEffect(() => {
    if (productTransaction) {
      // Convert price values from base currency to selected currency for display
      const convertedMinPrice = getExchangeAmount({
        amount: productTransaction.minPrice || 0,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      const convertedMaxPrice = getExchangeAmount({
        amount: productTransaction.maxPrice || 0,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      // Convert expense values from base currency to selected currency for display
      const convertedMinExpense = getExchangeAmount({
        amount: productTransaction.minExpense || 0,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      const convertedMaxExpense = getExchangeAmount({
        amount: productTransaction.maxExpense || 0,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      // Convert income values from base currency to selected currency for display
      const convertedMinIncome = getExchangeAmount({
        amount: productTransaction.minIncome || 0,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      const convertedMaxIncome = getExchangeAmount({
        amount: productTransaction.maxIncome || 0,
        fromCurrency: baseCurrency,
        toCurrency: selectedCurrency,
      });

      setFilterParams((prev) => ({
        ...prev,
        priceMin: convertedMinPrice.convertedAmount,
        priceMax: convertedMaxPrice.convertedAmount,
        taxRateMin: productTransaction.minTaxRate || 0,
        taxRateMax: productTransaction.maxTaxRate || 0,
        expenseMin: convertedMinExpense.convertedAmount,
        expenseMax: convertedMaxExpense.convertedAmount,
        incomeMin: convertedMinIncome.convertedAmount,
        incomeMax: convertedMaxIncome.convertedAmount,
      }));
    }
  }, [productTransaction, baseCurrency, selectedCurrency, getExchangeAmount]);

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

      // Extract price range from AND array or fallback to price property
      let currentPriceMin = productTransaction.minPrice || 0;
      let currentPriceMax = productTransaction.maxPrice || 0;

      // Check AND array for baseAmount
      if (Array.isArray(filters.AND)) {
        filters.AND.forEach((condition: any) => {
          if (condition.baseAmount) {
            if (condition.baseAmount.gte !== undefined) {
              // Convert from base currency to selected currency for display
              const convertedMin = getExchangeAmount({
                amount: condition.baseAmount.gte,
                fromCurrency: baseCurrency,
                toCurrency: selectedCurrency,
              });
              currentPriceMin = convertedMin.convertedAmount;
            }
            if (condition.baseAmount.lte !== undefined) {
              // Convert from base currency to selected currency for display
              const convertedMax = getExchangeAmount({
                amount: condition.baseAmount.lte,
                fromCurrency: baseCurrency,
                toCurrency: selectedCurrency,
              });
              currentPriceMax = convertedMax.convertedAmount;
            }
          }
        });
      }
      // Fallback to price property
      else if (filters.price && typeof filters.price === 'object') {
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

      // Extract expense and income from transactions with new baseAmount structure
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
              // Handle new baseAmount structure with AND array
              if (
                orCondition.transaction.type === 'Expense' &&
                Array.isArray(orCondition.transaction.AND)
              ) {
                orCondition.transaction.AND.forEach((andCondition: any) => {
                  if (andCondition.baseAmount) {
                    if (andCondition.baseAmount.gte !== undefined) {
                      // Convert from base currency to selected currency for display
                      const convertedMin = getExchangeAmount({
                        amount: andCondition.baseAmount.gte,
                        fromCurrency: baseCurrency,
                        toCurrency: selectedCurrency,
                      });
                      currentExpenseMin = convertedMin.convertedAmount;
                    }
                    if (andCondition.baseAmount.lte !== undefined) {
                      // Convert from base currency to selected currency for display
                      const convertedMax = getExchangeAmount({
                        amount: andCondition.baseAmount.lte,
                        fromCurrency: baseCurrency,
                        toCurrency: selectedCurrency,
                      });
                      currentExpenseMax = convertedMax.convertedAmount;
                    }
                  }
                });
              }
              // Handle new baseAmount structure with AND array for Income
              else if (
                orCondition.transaction.type === 'Income' &&
                Array.isArray(orCondition.transaction.AND)
              ) {
                orCondition.transaction.AND.forEach((andCondition: any) => {
                  if (andCondition.baseAmount) {
                    if (andCondition.baseAmount.gte !== undefined) {
                      // Convert from base currency to selected currency for display
                      const convertedMin = getExchangeAmount({
                        amount: andCondition.baseAmount.gte,
                        fromCurrency: baseCurrency,
                        toCurrency: selectedCurrency,
                      });
                      currentIncomeMin = convertedMin.convertedAmount;
                    }
                    if (andCondition.baseAmount.lte !== undefined) {
                      // Convert from base currency to selected currency for display
                      const convertedMax = getExchangeAmount({
                        amount: andCondition.baseAmount.lte,
                        fromCurrency: baseCurrency,
                        toCurrency: selectedCurrency,
                      });
                      currentIncomeMax = convertedMax.convertedAmount;
                    }
                  }
                });
              }
              // Fallback to old amount structure for backward compatibility
              else if (
                orCondition.transaction.type === 'Expense' &&
                orCondition.transaction.amount
              ) {
                const amount = orCondition.transaction.amount as RangeCondition;
                if (amount.gte !== undefined) currentExpenseMin = amount.gte;
                if (amount.lte !== undefined) currentExpenseMax = amount.lte;
              } else if (
                orCondition.transaction.type === 'Income' &&
                orCondition.transaction.amount
              ) {
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
    [productTransaction, baseCurrency, selectedCurrency, getExchangeAmount],
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
        label={`Expense Range (${selectedCurrency})`}
        minLabel="Min Expense"
        maxLabel="Max Expense"
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
        label={`Price Range (${selectedCurrency})`}
        minLabel="Min Price"
        maxLabel="Max Price"
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
        label={`Income Range (${selectedCurrency})`}
        minLabel="Min Income"
        maxLabel="Max Income"
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
  }, [filterParams, productTransaction, selectedCurrency]);

  // Create filter structure from UI state
  const createFilterStructure = useCallback(
    (params: ExtendedFilterParams): Record<string, unknown> => {
      const updatedFilters: Record<string, unknown> = {};
      const andConditions: any[] = [];

      // Add type filter if selected using the new 'in' operator format
      if (params.types.length > 1) {
        updatedFilters.type = {
          in: params.types,
        };
      } else if (params.types.length === 1) {
        updatedFilters.type = params.types[0];
      }

      // Add price range filter with base currency conversion
      const convertedMinPrice = getExchangeAmount({
        amount: params.priceMin,
        fromCurrency: selectedCurrency,
        toCurrency: baseCurrency,
      });

      const convertedMaxPrice = getExchangeAmount({
        amount: params.priceMax,
        fromCurrency: selectedCurrency,
        toCurrency: baseCurrency,
      });

      // Add baseCurrency and baseAmount to AND array
      andConditions.push({
        baseCurrency: baseCurrency,
      });

      andConditions.push({
        baseAmount: {
          gte: convertedMinPrice.convertedAmount,
          lte: convertedMaxPrice.convertedAmount,
        },
      });

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

        // Add expense filter if different from default with new baseAmount structure
        if (!isExpenseDefault) {
          const convertedMinExpense = getExchangeAmount({
            amount: params.expenseMin,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          const convertedMaxExpense = getExchangeAmount({
            amount: params.expenseMax,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          transactionConditions.push({
            transaction: {
              type: 'Expense',
              AND: [
                {
                  baseCurrency: baseCurrency,
                },
                {
                  baseAmount: {
                    gte: convertedMinExpense.convertedAmount,
                    lte: convertedMaxExpense.convertedAmount,
                  },
                },
              ],
            },
          });
        }

        // Add income filter if different from default with new baseAmount structure
        if (!isIncomeDefault) {
          const convertedMinIncome = getExchangeAmount({
            amount: params.incomeMin,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          const convertedMaxIncome = getExchangeAmount({
            amount: params.incomeMax,
            fromCurrency: selectedCurrency,
            toCurrency: baseCurrency,
          });

          transactionConditions.push({
            transaction: {
              type: 'Income',
              AND: [
                {
                  baseCurrency: baseCurrency,
                },
                {
                  baseAmount: {
                    gte: convertedMinIncome.convertedAmount,
                    lte: convertedMaxIncome.convertedAmount,
                  },
                },
              ],
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

      // Add AND conditions if there are any
      if (andConditions.length > 0) {
        updatedFilters.AND = andConditions;
      }

      return updatedFilters;
    },
    [productTransaction, baseCurrency, selectedCurrency, getExchangeAmount],
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
      currentFilter={filterCriteria.filters}
    />
  );
};

export default FilterMenu;
