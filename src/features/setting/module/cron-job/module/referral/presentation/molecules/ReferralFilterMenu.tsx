import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types';
import { useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReferralCronjobFilterState } from '../../slices/types';
import { useReferralFilterOptions } from '../hooks/useReferralFilterOptions';
import { ReferralCronjobTableData } from '../types/referral.type';

// Local filter state type for managing filter changes before applying
interface LocalFilterState {
  status: string[];
  typeOfBenefit: string[];
  emailReferrer: string[];
  emailReferee: string[];
  updatedBy: string[];
  search: string;
  fromDate: Date | null;
  toDate: Date | null;
}

// Initialize local filter state
const getInitialLocalFilterState = (): LocalFilterState => ({
  status: [],
  typeOfBenefit: [],
  emailReferrer: [],
  emailReferee: [],
  updatedBy: [],
  search: '',
  fromDate: null,
  toDate: null,
});

// Status filter options
const STATUS_OPTIONS = [
  { value: 'successful', label: 'Successful' },
  { value: 'fail', label: 'Fail' },
];

// Type of benefit filter options
const TYPE_OF_BENEFIT_OPTIONS = [
  { value: 'Referral Campaign', label: 'Referral Campaign' },
  { value: 'Referral Bonus', label: 'Referral Bonus' },
  { value: 'Referral Kickback', label: 'Referral Kickback' },
];

interface ReferralFilterMenuProps {
  value: ReferralCronjobFilterState;
  onFilterChange: (newFilter: ReferralCronjobFilterState) => void;
  data?: ReferralCronjobTableData[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReferralFilterMenu = ({ value, onFilterChange, data = [] }: ReferralFilterMenuProps) => {
  const reduxFilter = useAppSelector((state) => state.referralCronjob.filter);
  const { filterOptions, loadFilterOptions } = useReferralFilterOptions();

  // Local state for managing filter changes before applying
  const [localFilter, setLocalFilter] = useState<LocalFilterState>(() => {
    // Initialize local filter from Redux state
    return {
      status: value.status,
      typeOfBenefit: value.typeOfBenefit,
      emailReferrer: value.emailReferrer,
      emailReferee: value.emailReferee,
      updatedBy: value.updatedBy,
      search: value.search,
      fromDate: value.fromDate,
      toDate: value.toDate,
    };
  });

  // Use filter options from API instead of extracting from local data
  const emailReferrerOptions = filterOptions.emailReferrer;
  const emailRefereeOptions = filterOptions.emailReferee;
  const updatedByOptions = filterOptions.updatedBy;

  // Sync local filter with Redux state changes
  useEffect(() => {
    setLocalFilter({
      status: reduxFilter.status,
      typeOfBenefit: reduxFilter.typeOfBenefit,
      emailReferrer: reduxFilter.emailReferrer,
      emailReferee: reduxFilter.emailReferee,
      updatedBy: reduxFilter.updatedBy,
      search: reduxFilter.search,
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
      localFilter.typeOfBenefit.length > 0 ||
      localFilter.emailReferrer.length > 0 ||
      localFilter.emailReferee.length > 0 ||
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
    const newFilter: ReferralCronjobFilterState = {
      status: localFilter.status.length > 0 ? localFilter.status : [],
      typeOfBenefit: localFilter.typeOfBenefit.length > 0 ? localFilter.typeOfBenefit : [],
      emailReferrer: localFilter.emailReferrer.length > 0 ? localFilter.emailReferrer : [],
      emailReferee: localFilter.emailReferee.length > 0 ? localFilter.emailReferee : [],
      updatedBy: localFilter.updatedBy.length > 0 ? localFilter.updatedBy : [],
      search: localFilter.search || '',
      fromDate: localFilter.fromDate,
      toDate: localFilter.toDate,
    };

    onFilterChange(newFilter);
  }, [localFilter, onFilterChange]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const resetFilter = getInitialLocalFilterState();
    setLocalFilter(resetFilter);

    // Apply empty filter to Redux
    const newFilter: ReferralCronjobFilterState = {
      status: [],
      typeOfBenefit: [],
      emailReferrer: [],
      emailReferee: [],
      updatedBy: [],
      search: '',
      fromDate: null,
      toDate: null,
    };

    onFilterChange(newFilter);
  }, [onFilterChange]);

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
        key: 'typeOfBenefit',
        component: (
          <MultiSelectFilter
            options={TYPE_OF_BENEFIT_OPTIONS}
            selectedValues={localFilter.typeOfBenefit}
            onChange={(values) => handleLocalFilterChange('typeOfBenefit', values)}
            label="Type of Benefit"
            placeholder="Select type of benefit"
          />
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'emailReferrer',
        component: (
          <MultiSelectFilter
            options={emailReferrerOptions}
            selectedValues={localFilter.emailReferrer}
            onChange={(values) => handleLocalFilterChange('emailReferrer', values)}
            label="Email Referrer"
            placeholder="Select email referrer"
            onOpenChange={(open) => {
              if (open) {
                loadFilterOptions();
              }
            }}
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
        key: 'emailReferee',
        component: (
          <MultiSelectFilter
            options={emailRefereeOptions}
            selectedValues={localFilter.emailReferee}
            onChange={(values) => handleLocalFilterChange('emailReferee', values)}
            label="Email Referee"
            placeholder="Select email referee"
            onOpenChange={(open) => {
              if (open) {
                loadFilterOptions();
              }
            }}
          />
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
      {
        key: 'updatedBy',
        component: (
          <MultiSelectFilter
            options={updatedByOptions}
            selectedValues={localFilter.updatedBy}
            onChange={(values) => handleLocalFilterChange('updatedBy', values)}
            label="Updated By"
            placeholder="Select updated by"
            onOpenChange={(open) => {
              if (open) {
                loadFilterOptions();
              }
            }}
          />
        ),
        column: FilterColumn.RIGHT,
        order: 2,
      },
    ],
    [
      localFilter,
      dateRange,
      handleLocalFilterChange,
      handleDateRangeChange,
      emailReferrerOptions,
      emailRefereeOptions,
      updatedByOptions,
      loadFilterOptions,
    ],
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

export default ReferralFilterMenu;
