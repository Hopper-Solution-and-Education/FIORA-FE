import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { useCallback, useMemo, useState } from 'react';

// Define the default filter criteria
export const DEFAULT_DASHBOARD_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

// Define the filter parameters type
export type FilterParams = {
  products: string[];
  expenseMin: number;
  expenseMax: number;
  priceMin: number;
  priceMax: number;
  taxRateMin: number;
  taxRateMax: number;
  incomeMin: number;
  incomeMax: number;
};

export const filterParamsInitState: FilterParams = {
  products: [],
  expenseMin: 0,
  expenseMax: 100000,
  priceMin: 0,
  priceMax: 100000,
  taxRateMin: 1,
  taxRateMax: 100,
  incomeMin: 0,
  incomeMax: 100000,
};

interface FilterMenuProps {
  onFilterChange: (newFilter: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
  productOptions?: Array<{ value: string; label: string }>;
}

const FilterMenu = ({ onFilterChange, filterCriteria, productOptions = [] }: FilterMenuProps) => {
  // State for filter parameters
  const [filterParams, setFilterParams] = useState<FilterParams>(filterParamsInitState);

  // Handler for filter edits
  const handleEditFilter = (target: keyof FilterParams, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  // Create filter components
  const filterComponents = useMemo(() => {
    // Default product options if none provided
    const defaultProductOptions =
      productOptions.length > 0
        ? productOptions
        : [
            { value: 'Product A', label: 'Product A' },
            { value: 'Product B', label: 'Product B' },
            { value: 'Product C', label: 'Product C' },
          ];

    // Product multi-select filter
    const productFilterComponent = (
      <MultiSelectFilter
        options={defaultProductOptions}
        selectedValues={filterParams.products}
        onChange={(values) => handleEditFilter('products', values)}
        label="Products"
        placeholder="Select products"
      />
    );

    // Expense range filter with currency formatting
    const expenseFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.expenseMin}
        maxValue={filterParams.expenseMax}
        minRange={0}
        maxRange={1000000}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'expenseMin' : 'expenseMax', value)
        }
        label="Expense Range"
        minLabel="Min Expense"
        maxLabel="Max Expense"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `$${value.toLocaleString()}`}
        step={1000}
      />
    );

    // Price range filter with currency formatting
    const priceFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.priceMin}
        maxValue={filterParams.priceMax}
        minRange={0}
        maxRange={1000000}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'priceMin' : 'priceMax', value)
        }
        label="Price Range"
        minLabel="Min Price"
        maxLabel="Max Price"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `$${value.toLocaleString()}`}
        step={1000}
      />
    );

    // Tax rate range filter
    const taxRateFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.taxRateMin}
        maxValue={filterParams.taxRateMax}
        minRange={1}
        maxRange={100}
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
        minRange={0}
        maxRange={1000000}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'incomeMin' : 'incomeMax', value)
        }
        label="Income Range"
        minLabel="Min Income"
        maxLabel="Max Income"
        formatValue={(value, isEditing) => (isEditing ? value : value.toLocaleString())}
        tooltipFormat={(value) => `$${value.toLocaleString()}`}
        step={1000}
      />
    );

    return [
      {
        key: 'productFilter',
        component: productFilterComponent,
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
  }, [filterParams, productOptions]);

  // Create filter structure from UI state
  const createFilterStructure = useCallback((params: FilterParams): Record<string, any> => {
    const updatedFilters: Record<string, any> = {};
    const andConditions: Record<string, any>[] = [];

    // Add product filter if selected
    if (params.products.length > 0) {
      andConditions.push({
        OR: params.products.map((product) => ({
          name: product,
        })),
      });
    }

    // Add expense range filter
    andConditions.push({
      expense: {
        gte: params.expenseMin,
        lte: params.expenseMax,
      },
    });

    // Add price range filter
    andConditions.push({
      price: {
        gte: params.priceMin,
        lte: params.priceMax,
      },
    });

    // Add tax rate filter
    andConditions.push({
      taxRate: {
        gte: params.taxRateMin,
        lte: params.taxRateMax,
      },
    });

    // Add income filter
    andConditions.push({
      income: {
        gte: params.incomeMin,
        lte: params.incomeMax,
      },
    });

    // Add AND conditions
    if (andConditions.length > 0) {
      updatedFilters.AND = andConditions;
    }

    return updatedFilters;
  }, []);

  return (
    <GlobalFilter<FilterParams>
      filterParams={filterParams}
      filterComponents={filterComponents}
      onFilterChange={(newFilter) => {
        onFilterChange({
          ...filterCriteria,
          filters: newFilter.filters,
        });
      }}
      defaultFilterCriteria={DEFAULT_DASHBOARD_FILTER_CRITERIA}
      structureCreator={createFilterStructure}
    />
  );
};

export default FilterMenu;
