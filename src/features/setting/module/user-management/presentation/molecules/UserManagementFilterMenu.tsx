import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { UserRole } from '@prisma/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { clearUserFilters, setUserFilters } from '../../slices';
import { FilterState } from '../../slices/type';

const getInitialFilterState = (): FilterState => ({
  roles: [],
  status: [],
  fromDate: null,
  toDate: null,
});

const ROLE_OPTIONS = [
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.User, label: 'User' },
  { value: UserRole.CS, label: 'CS' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'all', label: 'All' },
];

interface UserManagementFilterMenuProps {
  value: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
}

const UserManagementFilterMenu = ({
  value,
  onFilterChange,
}: UserManagementFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.userManagement.filters);

  const [localFilter, setLocalFilter] = useState<FilterState>(value || getInitialFilterState());

  useEffect(() => {
    setLocalFilter({
      roles: reduxFilter.roles || [],
      status: reduxFilter.status || [],
      fromDate: reduxFilter.fromDate || null,
      toDate: reduxFilter.toDate || null,
    });
  }, [reduxFilter]);

  // Convert date range for display - add null check
  const dateRange: DateRange | undefined = useMemo(() => {
    if (!localFilter) return undefined;
    if (localFilter.fromDate || localFilter.toDate) {
      return {
        from: localFilter.fromDate || undefined,
        to: localFilter.toDate || undefined,
      };
    }
    return undefined;
  }, [localFilter]);

  const handleDateRangeChange = useCallback((dateRange: DateRange | undefined) => {
    setLocalFilter((prev) => ({
      ...prev,
      fromDate: dateRange?.from || null,
      toDate: dateRange?.to || null,
    }));
  }, []);

  // Check if any filter is applied
  const isFilterApplied = useMemo(() => {
    if (!localFilter) return false;
    return (
      localFilter.roles.length > 0 ||
      localFilter.status.length > 0 ||
      localFilter.fromDate !== null ||
      localFilter.toDate !== null
    );
  }, [localFilter]);

  const handleLocalFilterChange = useCallback((key: keyof FilterState, newValue: any) => {
    setLocalFilter((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    dispatch(setUserFilters(localFilter));

    onFilterChange(localFilter);
  }, [localFilter, onFilterChange, dispatch]);

  const handleResetFilters = useCallback(() => {
    const resetState = getInitialFilterState();

    setLocalFilter(resetState);

    dispatch(clearUserFilters());

    onFilterChange(resetState);
  }, [dispatch, onFilterChange]);

  // Filter components configuration
  const filterComponents: FilterComponentConfig[] = useMemo(
    () => [
      // LEFT COLUMN
      {
        key: 'roles',
        component: (
          <MultiSelectFilter
            options={ROLE_OPTIONS}
            selectedValues={localFilter.roles}
            onChange={(values) => handleLocalFilterChange('roles', values)}
            label="Roles"
            placeholder="Select roles"
          />
        ),
        column: FilterColumn.LEFT,
        order: 0,
      },
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
        order: 1,
      },
      // RIGHT COLUMN
      {
        key: 'dateRange',
        component: (
          <DateRangeFilter
            dateRange={dateRange}
            onChange={handleDateRangeChange}
            label="Date Range"
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

export default UserManagementFilterMenu;
