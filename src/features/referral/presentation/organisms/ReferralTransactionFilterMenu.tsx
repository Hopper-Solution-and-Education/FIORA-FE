'use client';

import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { clearFilter } from '../../slices';
import { ReferralTransactionFilterState } from '../../slices/types';

// Local filter state type for managing filter changes before applying
interface LocalFilterState {
  type: string[];
  search: string;
  fromDate: Date | null;
  toDate: Date | null;
}

// Initialize local filter state
const getInitialLocalFilterState = (): LocalFilterState => ({
  type: [],
  search: '',
  fromDate: null,
  toDate: null,
});

// Transaction type filter options
const TYPE_OPTIONS = [
  { value: 'Income', label: 'Income' },
  { value: 'Transfer', label: 'Transfer' },
];

interface ReferralTransactionFilterMenuProps {
  value: ReferralTransactionFilterState;
  onFilterChange: (newFilter: ReferralTransactionFilterState) => void;
}

const ReferralTransactionFilterMenu = ({
  value,
  onFilterChange,
}: ReferralTransactionFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.referralTransaction.filter);

  // Local state for managing filter changes before applying
  const [localFilter, setLocalFilter] = useState<LocalFilterState>(() => {
    // Initialize local filter from Redux state
    return {
      type: value.type || [],
      search: value.search || '',
      fromDate: value.fromDate,
      toDate: value.toDate,
    };
  });

  // Sync local filter with Redux state changes
  useEffect(() => {
    setLocalFilter({
      type: reduxFilter.type || [],
      search: reduxFilter.search || '',
      fromDate: reduxFilter.fromDate,
      toDate: reduxFilter.toDate,
    });
  }, [reduxFilter]);

  // Convert date range to individual dates for API
  const dateRange: DateRange | undefined = useMemo(() => {
    if (localFilter.fromDate || localFilter.toDate) {
      return {
        from: localFilter.fromDate || undefined,
        to: localFilter.toDate || undefined,
      };
    }
    return undefined;
  }, [localFilter.fromDate, localFilter.toDate]);

  // Check if any filter is applied (excluding search)
  const isFilterApplied = useMemo(() => {
    return (
      localFilter.type.length > 0 || localFilter.fromDate !== null || localFilter.toDate !== null
    );
  }, [localFilter]);

  // Handle local filter changes
  const handleLocalFilterChange = useCallback((key: keyof LocalFilterState, newValue: any) => {
    setLocalFilter((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  // Handle date range change
  const handleDateRangeChange = useCallback((dateRange: DateRange | undefined) => {
    setLocalFilter((prev) => ({
      ...prev,
      fromDate: dateRange?.from || null,
      toDate: dateRange?.to || null,
    }));
  }, []);

  // Apply filters to Redux state
  const handleApplyFilters = useCallback(() => {
    const newFilter: ReferralTransactionFilterState = {
      type: localFilter.type.length > 0 ? localFilter.type : null,
      search: localFilter.search || null,
      fromDate: localFilter.fromDate,
      toDate: localFilter.toDate,
    };

    onFilterChange(newFilter);
  }, [localFilter, onFilterChange]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setLocalFilter(getInitialLocalFilterState());
    dispatch(clearFilter());
  }, [dispatch]);

  // Filter components configuration
  const filterComponents: FilterComponentConfig[] = useMemo(
    () => [
      // LEFT COLUMN
      {
        key: 'type',
        component: (
          <MultiSelectFilter
            options={TYPE_OPTIONS}
            selectedValues={localFilter.type}
            onChange={(values) => handleLocalFilterChange('type', values)}
            label="Transaction Type"
            placeholder="Select type"
          />
        ),
        column: FilterColumn.LEFT,
        order: 0,
      },
      // RIGHT COLUMN
      {
        key: 'dateRange',
        component: (
          <DateRangeFilter
            dateRange={dateRange}
            onChange={handleDateRangeChange}
            label="Transaction Date Range"
            colorScheme="default"
            disableFuture={true}
            pastDaysLimit={365}
          />
        ),
        column: FilterColumn.RIGHT,
        order: 0,
      },
    ],
    [localFilter, dateRange, handleLocalFilterChange, handleDateRangeChange],
  );

  return (
    <GlobalFilter
      filterParams={localFilter}
      filterComponents={filterComponents}
      onFilterChange={handleApplyFilters}
      currentFilter={localFilter}
      onResetFilter={handleResetFilters}
      showFilterIcon={isFilterApplied}
    />
  );
};

export default ReferralTransactionFilterMenu;
