import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterCriteria } from '@/shared/types';

export interface FaqsFilterValues {
  search: string;
  categories: string[];
}

interface FaqsFilterProps {
  categories: string[];
  onFilterSubmit: (filters: FaqsFilterValues) => void;
  initialValues?: FaqsFilterValues;
  isLoading?: boolean;
}

const FaqsFilter = ({
  categories,
  onFilterSubmit,
  initialValues = { search: '', categories: [] },
  isLoading = false,
}: FaqsFilterProps) => {
  // Local state for form values (not yet submitted)
  const [formValues, setFormValues] = useState<FaqsFilterValues>(initialValues);

  // State for GlobalFilter
  const [filterParams, setFilterParams] = useState<FilterCriteria>({
    userId: '',
    filters: {
      search: initialValues.search,
      categories: initialValues.categories || [],
    },
  });

  // Handle search input change (immediate)
  const handleSearchChange = useCallback(
    (value: string) => {
      setFormValues((prev) => ({ ...prev, search: value }));
      // Trigger immediate search for search input
      onFilterSubmit({ ...formValues, search: value });
    },
    [formValues, onFilterSubmit],
  );

  // Category filter component for GlobalFilter
  const CategoryComponent = () => (
    <div className="space-y-2">
      <MultiSelectFilter
        options={categories.map((category) => ({
          label: category,
          value: category,
        }))}
        label="Categories"
        selectedValues={filterParams.filters.categories as string[]}
        onChange={(values) => {
          setFilterParams((prev) => ({
            ...prev,
            filters: {
              ...prev.filters,
              categories: values,
            },
          }));
        }}
        placeholder="Select categories"
      />
    </div>
  );

  // Filter components configuration for GlobalFilter
  const filterComponents = [
    {
      component: <CategoryComponent />,
      key: 'categories',
      column: FilterColumn.LEFT,
      order: 1,
    },
  ];

  // Check if any filters are active for GlobalFilter
  const hasActiveFilters =
    (filterParams.filters.search as string)?.trim() !== '' ||
    (filterParams.filters.categories as string[]).length > 0;

  // Default filter criteria for reset functionality
  const defaultFilterCriteria: FilterCriteria = {
    userId: '',
    filters: { search: '', categories: [] },
  };

  // Handle GlobalFilter changes (when user clicks Apply)
  const handleGlobalFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      setFilterParams(newFilter);

      // Convert FilterCriteria to FaqsFilterValues and submit
      const filterValues: FaqsFilterValues = {
        search: (newFilter.filters.search as string) || '',
        categories: (newFilter.filters.categories as string[]) || [],
      };

      setFormValues(filterValues);
      onFilterSubmit(filterValues);
    },
    [onFilterSubmit],
  );

  return (
    <div className="flex items-center gap-3">
      {/* Search Input - immediate search */}
      <div className="relative flex-1 min-w-[300px]">
        <Input
          placeholder="Search FAQs..."
          value={formValues.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pr-10"
          disabled={isLoading}
        />
        <Search size={16} className="absolute top-[50%] right-3 -translate-y-[50%] opacity-50" />
      </div>

      {/* GlobalFilter for category filtering */}
      <GlobalFilter
        filterParams={filterParams}
        filterComponents={filterComponents}
        onFilterChange={handleGlobalFilterChange}
        defaultFilterCriteria={defaultFilterCriteria}
        structureCreator={(params) => params.filters}
        currentFilter={hasActiveFilters ? filterParams.filters : {}}
      />
    </div>
  );
};

export default FaqsFilter;
