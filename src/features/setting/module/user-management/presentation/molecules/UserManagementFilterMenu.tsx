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
import { useSession } from 'next-auth/react';

const getInitialFilterState = (): FilterState => ({
  roles: [],
  status: [],
  fromDate: null,
  toDate: null,
  emails: [],
  userFromDate: null,
  userToDate: null,
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
  emailOptions: Array<{ value: string; label: string }>;
}

const UserManagementFilterMenu = ({
  value,
  onFilterChange,
  emailOptions = [],
}: UserManagementFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.userManagement.filters);
  const { data: session } = useSession();
  const currentUserRole = session?.user.role; 
  const isCS = currentUserRole === UserRole.CS;

  const [localFilter, setLocalFilter] = useState<FilterState>(value || getInitialFilterState());

  useEffect(() => {
    setLocalFilter({
      roles: reduxFilter.roles || [],
      status: reduxFilter.status || [],
      fromDate: reduxFilter.fromDate || null,
      toDate: reduxFilter.toDate || null,
      emails: reduxFilter.emails || [],
      userFromDate: reduxFilter.userFromDate || null,
      userToDate: reduxFilter.userToDate || null,
    });
  }, [reduxFilter]);

  // Convert KYC date range for display
  const kycDateRange: DateRange | undefined = useMemo(() => {
    if (!localFilter) return undefined;
    if (localFilter.fromDate || localFilter.toDate) {
      return {
        from: localFilter.fromDate || undefined,
        to: localFilter.toDate || undefined,
      };
    }
    return undefined;
  }, [localFilter]);

  // Convert User Registration date range for display
  const userDateRange: DateRange | undefined = useMemo(() => {
    if (!localFilter) return undefined;
    if (localFilter.userFromDate || localFilter.userToDate) {
      return {
        from: localFilter.userFromDate || undefined,
        to: localFilter.userToDate || undefined,
      };
    }
    return undefined;
  }, [localFilter]);

  const handleKycDateRangeChange = useCallback((dateRange: DateRange | undefined) => {
    setLocalFilter((prev) => ({
      ...prev,
      fromDate: dateRange?.from || null,
      toDate: dateRange?.to || null,
    }));
  }, []);

  const handleUserDateRangeChange = useCallback((dateRange: DateRange | undefined) => {
    setLocalFilter((prev) => ({
      ...prev,
      userFromDate: dateRange?.from || null,
      userToDate: dateRange?.to || null,
    }));
  }, []);

  // Check if any filter is applied
  const isFilterApplied = useMemo(() => {
    if (!localFilter) return false;

    // For CS
    if (isCS) {
      return (
        localFilter.fromDate !== null ||
        localFilter.toDate !== null ||
        localFilter.userFromDate !== null ||
        localFilter.userToDate !== null ||
        localFilter.emails.length > 0
      );
    }

    // For Admin, check all filters
    return (
      localFilter.roles.length > 0 ||
      localFilter.status.length > 0 ||
      localFilter.fromDate !== null ||
      localFilter.toDate !== null ||
      localFilter.userFromDate !== null ||
      localFilter.userToDate !== null ||
      localFilter.emails.length > 0
    );
  }, [localFilter, isCS]);

  const handleLocalFilterChange = useCallback((key: keyof FilterState, newValue: any) => {
    setLocalFilter((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    // If CS, clear roles and status before applying
    const filterToApply = isCS
      ? {
          ...localFilter,
          roles: [],
          status: [],
        }
      : localFilter;

    dispatch(setUserFilters(filterToApply));

    onFilterChange(filterToApply);
  }, [localFilter, onFilterChange, dispatch, isCS]);

  const handleResetFilters = useCallback(() => {
    const resetState = getInitialFilterState();

    setLocalFilter(resetState);
    dispatch(clearUserFilters());

    onFilterChange(resetState);
  }, [dispatch, onFilterChange]);

  // Filter components configuration
  const filterComponents: FilterComponentConfig[] = useMemo(() => {
    const components: FilterComponentConfig[] = [];

    // LEFT COLUMN
    // Only add Roles filter if NOT CS
    if (!isCS) {
      components.push({
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
      });
    }

    // Only add Status filter if NOT CS
    if (!isCS) {
      components.push({
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
      });
    }

    // Email Filter - MultiSelect instead of input text
    components.push({
      key: 'emails',
      component: (
        <MultiSelectFilter
          options={emailOptions ?? []}
          selectedValues={localFilter.emails}
          onChange={(values) => handleLocalFilterChange('emails', values)}
          label="Emails"
          placeholder="Select emails"
        />
      ),
      column: FilterColumn.LEFT,
      order: isCS ? 0 : 2,
    });
    

    // RIGHT COLUMN
    // KYC Date Range filter - Always show
    components.push({
      key: 'kycDateRange',
      component: (
        <DateRangeFilter
          dateRange={kycDateRange}
          onChange={handleKycDateRangeChange}
          label="KYC Submission Date"
          colorScheme="default"
          disableFuture={true}
          pastDaysLimit={365}
        />
      ),
      column: FilterColumn.RIGHT,
      order: 0,
    });

    // User Registration Date Range filter - Always show
    components.push({
      key: 'userDateRange',
      component: (
        <DateRangeFilter
          dateRange={userDateRange}
          onChange={handleUserDateRangeChange}
          label="Registration Date"
          colorScheme="default"
          disableFuture={true}
          pastDaysLimit={365}
        />
      ),
      column: FilterColumn.RIGHT,
      order: 1,
    });

    return components;
  }, [
    localFilter,
    kycDateRange,
    userDateRange,
    emailOptions,
    handleLocalFilterChange,
    handleKycDateRangeChange,
    handleUserDateRangeChange,
    isCS,
  ]);

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
