import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FilterOptions } from '../../data/api/ISavingInterestDashboardApi';
import { savingInterestContainer } from '../../di/savingInterestDashboardDI';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';
import { IGetSavingInterestFilterOptionsUseCase } from '../../domain/usecase/GetSavingInterestFilterOptionsUseCase';
import { SavingInterestFilterState } from '../../slices';
import { SavingInterestTableData } from '../types/saving-interest.type';

interface SavingInterestFilterMenuProps {
  value: SavingInterestFilterState;
  onFilterChange: (newFilter: SavingInterestFilterState) => void;
  data?: SavingInterestTableData[];
}

const STATUS_OPTIONS = [
  { label: 'Successful', value: 'SUCCESSFUL' },
  { label: 'Fail', value: 'FAIL' },
];

const SavingInterestFilterMenu = ({
  value,
  onFilterChange,
  data = [],
}: SavingInterestFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const [localFilter, setLocalFilter] = useState<SavingInterestFilterState>(value);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    emailOptions: [],
    tierNameOptions: [],
    updateByOptions: [],
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Sync localFilter with value prop changes (e.g., from Redux store updates)
  useEffect(() => {
    setLocalFilter(value);
  }, [value]);

  // Fetch filter options only when needed (lazy loading)
  const fetchFilterOptions = useCallback(async () => {
    if (isLoadingOptions || filterOptions.emailOptions.length > 0) {
      return; // Already loading or already loaded
    }

    setIsLoadingOptions(true);
    try {
      const useCase = savingInterestContainer.get<IGetSavingInterestFilterOptionsUseCase>(
        SAVING_INTEREST_TYPES.IGetSavingInterestFilterOptionsUseCase,
      );
      const options = await useCase.execute();
      setFilterOptions(options);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Fallback to empty options
      setFilterOptions({
        emailOptions: [],
        tierNameOptions: [],
        updateByOptions: [],
      });
    } finally {
      setIsLoadingOptions(false);
    }
  }, [isLoadingOptions, filterOptions.emailOptions.length]);

  // Convert API options to select options format
  const emailOptions = useMemo(() => {
    return filterOptions.emailOptions.map((option) => ({
      label: option.email,
      value: option.id, // Changed from option.email to option.id
    }));
  }, [filterOptions.emailOptions]);

  const membershipTierOptions = useMemo(() => {
    return filterOptions.tierNameOptions.map((option) => ({
      label: option.tierName || 'Unknown',
      value: option.tierName || 'Unknown',
    }));
  }, [filterOptions.tierNameOptions]);

  const updatedByOptions = useMemo(() => {
    return filterOptions.updateByOptions.map((option) => ({
      label: option.email,
      value: option.id, // Changed from option.email to option.id
    }));
  }, [filterOptions.updateByOptions]);

  // Date range state
  const dateRange: DateRange | undefined = useMemo(() => {
    if (localFilter.fromDate && localFilter.toDate) {
      return {
        from: localFilter.fromDate,
        to: localFilter.toDate,
      };
    }
    return undefined;
  }, [localFilter.fromDate, localFilter.toDate]);

  const handleLocalFilterChange = useCallback(
    (key: keyof SavingInterestFilterState, newValue: any) => {
      setLocalFilter((prev) => ({
        ...prev,
        [key]: newValue,
      }));
    },
    [],
  );

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setLocalFilter((prev) => ({
      ...prev,
      fromDate: range?.from || null,
      toDate: range?.to || null,
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    onFilterChange(localFilter);
  }, [localFilter, onFilterChange]);

  const handleResetFilters = useCallback(() => {
    const today = new Date();
    const newFilter: SavingInterestFilterState = {
      status: [],
      membershipTier: [],
      email: [],
      updatedBy: [],
      search: '',
      fromDate: today,
      toDate: today,
    };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  }, [onFilterChange]);

  // Check if any filters are applied
  const isFilterApplied = useMemo(() => {
    return (
      localFilter.status.length > 0 ||
      localFilter.membershipTier.length > 0 ||
      localFilter.email.length > 0 ||
      localFilter.updatedBy.length > 0 ||
      localFilter.fromDate !== null ||
      localFilter.toDate !== null
    );
  }, [localFilter]);

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
        key: 'membershipTier',
        component: (
          <MultiSelectFilter
            options={membershipTierOptions}
            selectedValues={localFilter.membershipTier}
            onChange={(values) => handleLocalFilterChange('membershipTier', values)}
            label="Membership Tier"
            placeholder={isLoadingOptions ? 'Loading...' : 'Select membership tier'}
            onOpenChange={(open) => {
              if (open) {
                fetchFilterOptions();
              }
            }}
          />
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'email',
        component: (
          <MultiSelectFilter
            options={emailOptions}
            selectedValues={localFilter.email}
            onChange={(values) => handleLocalFilterChange('email', values)}
            label="Email"
            placeholder={isLoadingOptions ? 'Loading...' : 'Select email'}
            onOpenChange={(open) => {
              if (open) {
                fetchFilterOptions();
              }
            }}
          />
        ),
        column: FilterColumn.LEFT,
        order: 2,
      },
      // RIGHT COLUMN
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
        key: 'updatedBy',
        component: (
          <MultiSelectFilter
            options={updatedByOptions}
            selectedValues={localFilter.updatedBy}
            onChange={(values) => handleLocalFilterChange('updatedBy', values)}
            label="Updated By"
            placeholder={isLoadingOptions ? 'Loading...' : 'Select updated by'}
            onOpenChange={(open) => {
              if (open) {
                fetchFilterOptions();
              }
            }}
          />
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
    ],
    [
      localFilter,
      dateRange,
      handleLocalFilterChange,
      handleDateRangeChange,
      emailOptions,
      membershipTierOptions,
      updatedByOptions,
      isLoadingOptions,
      fetchFilterOptions,
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

export default SavingInterestFilterMenu;
