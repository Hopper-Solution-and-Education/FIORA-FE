import React, { useState, useCallback, useMemo, useEffect } from 'react';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterCriteria } from '@/shared/types/filter.types';
import { FaqsCategoriesResponse } from '../../domain/entities/models/faqs';
import { FaqsFilterValues } from '../organisms/FaqsPageHeader';

interface FaqsFilterMenuProps {
  categories: FaqsCategoriesResponse[];
  activeFilters: FaqsFilterValues;
  onFilterChange: (filters: FaqsFilterValues) => void;
}

interface FaqsFilterState {
  categories: string[];
}

const FaqsFilterMenu = ({ categories, activeFilters, onFilterChange }: FaqsFilterMenuProps) => {
  // Local filter state for the menu
  const [localFilters, setLocalFilters] = useState<FaqsFilterState>({
    categories: activeFilters.categories,
  });

  // Sync local filters with active filters when they change externally
  useEffect(() => {
    setLocalFilters({ categories: activeFilters.categories });
  }, [activeFilters.categories]);

  // Category filter component
  const CategoryFilterComponent = useMemo(
    () => (
      <div className="space-y-2">
        <MultiSelectFilter
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          label="Categories"
          selectedValues={localFilters.categories}
          onChange={(selectedCategories) => {
            setLocalFilters({ categories: selectedCategories });
          }}
          placeholder="Select categories"
        />
      </div>
    ),
    [categories, localFilters.categories],
  );

  // Filter components configuration
  const filterComponents = useMemo(
    () => [
      {
        component: CategoryFilterComponent,
        key: 'categories',
        column: FilterColumn.LEFT,
        order: 1,
      },
    ],
    [CategoryFilterComponent],
  );

  // Check if any filters are active
  const hasActiveFilters = localFilters.categories.length > 0;

  // Default filter criteria for reset
  const defaultFilterCriteria: FilterCriteria = useMemo(
    () => ({
      userId: '',
      filters: { categories: [] },
    }),
    [],
  );

  // Create FilterCriteria from local state
  const filterParams: FilterCriteria = useMemo(
    () => ({
      userId: '',
      filters: { categories: localFilters.categories },
    }),
    [localFilters.categories],
  );

  // Handle filter changes from GlobalFilter
  const handleFilterChange = useCallback(
    (newFilterCriteria: FilterCriteria) => {
      const newCategories = (newFilterCriteria.filters.categories as string[]) || [];

      // Update local state
      setLocalFilters({ categories: newCategories });

      // Convert to FaqsFilterValues and notify parent
      const updatedFilters: FaqsFilterValues = {
        search: activeFilters.search, // Preserve current search
        categories: newCategories,
      };

      onFilterChange(updatedFilters);
    },
    [activeFilters.search, onFilterChange],
  );

  const structureCreator = useCallback((params: FilterCriteria) => params.filters, []);

  return (
    <GlobalFilter
      filterParams={filterParams}
      filterComponents={filterComponents}
      onFilterChange={handleFilterChange}
      defaultFilterCriteria={defaultFilterCriteria}
      structureCreator={structureCreator}
      currentFilter={hasActiveFilters ? filterParams.filters : {}}
      showFilterHeader={false}
    />
  );
};

export default FaqsFilterMenu;
