import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { clearFilter } from '../../slices';
import { MembershipCronjobFilterState } from '../../slices/types';

// Local filter state type for managing filter changes before applying
interface LocalFilterState {
  status: string[];
  fromTier: string[];
  toTier: string[];
  email: string[];
  updatedBy: string[];
  search: string;
  fromDate: Date | null;
  toDate: Date | null;
}

// Initialize local filter state
const getInitialLocalFilterState = (): LocalFilterState => ({
  status: [],
  fromTier: [],
  toTier: [],
  email: [],
  updatedBy: [],
  search: '',
  fromDate: null,
  toDate: null,
});

// Status filter options
const STATUS_OPTIONS = [
  { value: 'successful', label: 'Successful' },
  { value: 'fail', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
];

// Tier filter options - mock data for now
const TIER_OPTIONS = [
  { value: 'platinum-qili', label: 'Platinum Qili' },
  { value: 'gold-qili', label: 'Gold Qili' },
  { value: 'silver-qili', label: 'Silver Qili' },
  { value: 'bronze-qili', label: 'Bronze Qili' },
  { value: 'titan-egg', label: 'Titan Egg' },
  { value: 'diamond-egg', label: 'Diamond Egg' },
  { value: 'diamond-dragon', label: 'Diamond Dragon' },
];

interface MembershipFilterMenuProps {
  value: MembershipCronjobFilterState;
  onFilterChange: (newFilter: MembershipCronjobFilterState) => void;
}

const MembershipFilterMenu = ({ value, onFilterChange }: MembershipFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.membershipCronjob.filter);

  // Local state for managing filter changes before applying
  const [localFilter, setLocalFilter] = useState<LocalFilterState>(() => {
    // Initialize local filter from Redux state
    return {
      status: value.status || [],
      fromTier: value.fromTier || [],
      toTier: value.toTier || [],
      email: value.email || [],
      updatedBy: value.updatedBy || [],
      search: value.search || '',
      fromDate: value.fromDate,
      toDate: value.toDate,
    };
  });

  // Sync local filter with Redux state changes
  useEffect(() => {
    setLocalFilter({
      status: reduxFilter.status || [],
      fromTier: reduxFilter.fromTier || [],
      toTier: reduxFilter.toTier || [],
      email: reduxFilter.email || [],
      updatedBy: reduxFilter.updatedBy || [],
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
      localFilter.status.length > 0 ||
      localFilter.fromTier.length > 0 ||
      localFilter.toTier.length > 0 ||
      localFilter.email.length > 0 ||
      localFilter.updatedBy.length > 0 ||
      localFilter.fromDate !== null ||
      localFilter.toDate !== null
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
    const newFilter: MembershipCronjobFilterState = {
      status: localFilter.status.length > 0 ? localFilter.status : null,
      fromTier: localFilter.fromTier.length > 0 ? localFilter.fromTier : null,
      toTier: localFilter.toTier.length > 0 ? localFilter.toTier : null,
      email: localFilter.email.length > 0 ? localFilter.email : null,
      updatedBy: localFilter.updatedBy.length > 0 ? localFilter.updatedBy : null,
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
        key: 'status',
        component: (
          <MultiSelectFilter
            options={STATUS_OPTIONS}
            selectedValues={localFilter.status}
            onChange={(values) => handleLocalFilterChange('status', values)}
            label="Status"
            placeholder="Select status"
          />
        ),
        column: FilterColumn.LEFT,
        order: 0,
      },
      {
        key: 'fromTier',
        component: (
          <MultiSelectFilter
            options={TIER_OPTIONS}
            selectedValues={localFilter.fromTier}
            onChange={(values) => handleLocalFilterChange('fromTier', values)}
            label="From Tier"
            placeholder="Select from tier"
          />
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'toTier',
        component: (
          <MultiSelectFilter
            options={TIER_OPTIONS}
            selectedValues={localFilter.toTier}
            onChange={(values) => handleLocalFilterChange('toTier', values)}
            label="To Tier"
            placeholder="Select to tier"
          />
        ),
        column: FilterColumn.LEFT,
        order: 2,
      },
      {
        key: 'dateRange',
        component: (
          <DateRangeFilter
            dateRange={dateRange}
            onChange={handleDateRangeChange}
            label="Execution Date Range"
            colorScheme="default"
            disableFuture={true}
            pastDaysLimit={365}
          />
        ),
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'email',
        component: (
          <MultiSelectFilter
            options={[]}
            selectedValues={localFilter.email}
            onChange={(values) => handleLocalFilterChange('email', values)}
            label="Email"
            placeholder="Select email"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
      {
        key: 'updatedBy',
        component: (
          <MultiSelectFilter
            options={[]}
            selectedValues={localFilter.updatedBy}
            onChange={(values) => handleLocalFilterChange('updatedBy', values)}
            label="Updated By"
            placeholder="Select updated by"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 2,
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

export default MembershipFilterMenu;
