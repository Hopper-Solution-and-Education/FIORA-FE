import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch } from '@/store';
import { useCallback, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { SavingInterestFilterState } from '../../slices';
import { SavingInterestTableData } from '../types/saving-interest.type';

interface SavingInterestFilterMenuProps {
  value: SavingInterestFilterState;
  onFilterChange: (newFilter: SavingInterestFilterState) => void;
  data?: SavingInterestTableData[];
}

const STATUS_OPTIONS = [
  { label: 'Successful', value: 'successful' },
  { label: 'Fail', value: 'fail' },
];

const MEMBERSHIP_TIER_OPTIONS = [
  { label: 'Titan Egg', value: 'Titan Egg' },
  { label: 'Silver Egg', value: 'Silver Egg' },
  { label: 'Platinum Egg', value: 'Platinum Egg' },
  { label: 'Gold Egg', value: 'Gold Egg' },
  { label: 'Diamond Egg', value: 'Diamond Egg' },
  { label: 'Titan Tortoise', value: 'Titan Tortoise' },
  { label: 'Silver Tortoise', value: 'Silver Tortoise' },
  { label: 'Gold Tortoise', value: 'Gold Tortoise' },
  { label: 'Platinum Tortoise', value: 'Platinum Tortoise' },
  { label: 'Diamond Tortoise', value: 'Diamond Tortoise' },
  { label: 'Titan Phoenix', value: 'Titan Phoenix' },
  { label: 'Silver Phoenix', value: 'Silver Phoenix' },
  { label: 'Gold Phoenix', value: 'Gold Phoenix' },
  { label: 'Platinum Phoenix', value: 'Platinum Phoenix' },
  { label: 'Diamond Phoenix', value: 'Diamond Phoenix' },
  { label: 'Titan Qili', value: 'Titan Qili' },
  { label: 'Silver Qili', value: 'Silver Qili' },
  { label: 'Gold Qili', value: 'Gold Qili' },
  { label: 'Platinum Qili', value: 'Platinum Qili' },
  { label: 'Diamond Qili', value: 'Diamond Qili' },
  { label: 'Titan Dragon', value: 'Titan Dragon' },
  { label: 'Silver Dragon', value: 'Silver Dragon' },
  { label: 'Gold Dragon', value: 'Gold Dragon' },
  { label: 'Platinum Dragon', value: 'Platinum Dragon' },
  { label: 'Diamond Dragon', value: 'Diamond Dragon' },
];

const SavingInterestFilterMenu = ({
  value,
  onFilterChange,
  data = [],
}: SavingInterestFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const [localFilter, setLocalFilter] = useState<SavingInterestFilterState>(value);

  // Extract unique values from data for dynamic options
  const emailOptions = useMemo(() => {
    const uniqueEmails = Array.from(new Set(data.map((item) => item.email)));
    return uniqueEmails.map((email) => ({ label: email, value: email }));
  }, [data]);

  const updatedByOptions = useMemo(() => {
    const uniqueUpdatedBy = Array.from(new Set(data.map((item) => item.updatedBy.email)));
    return uniqueUpdatedBy.map((email) => ({ label: email, value: email }));
  }, [data]);

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
    const newFilter: SavingInterestFilterState = {
      status: [],
      membershipTier: [],
      email: [],
      updatedBy: [],
      search: '',
      fromDate: null,
      toDate: null,
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
            options={MEMBERSHIP_TIER_OPTIONS}
            selectedValues={localFilter.membershipTier}
            onChange={(values) => handleLocalFilterChange('membershipTier', values)}
            label="Membership Tier"
            placeholder="Select membership tier"
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
            placeholder="Select email"
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
            placeholder="Select updated by"
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
      updatedByOptions,
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
