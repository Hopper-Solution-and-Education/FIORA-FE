import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { DateTimePicker } from '@/components/common/forms';
import { Label } from '@/components/ui/label';
import { FilterColumn, FilterComponentConfig } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { clearFilter } from '../slices';
import { FlexiInterestCronjobFilterState } from '../slices/type';

const initialLocalFilterState: FlexiInterestCronjobFilterState = {
  status: [],
  email: [],
  membershipTier: [],
  search: null,
  updatedBy: [],
  fromDate: null,
  toDate: null,
};

// Status filter options
const STATUS_OPTIONS = [
  { value: 'SUCCESSFUL', label: 'Successful' },
  { value: 'FAIL', label: 'Fail' },
];

interface FlexiInterestFilterMenuProps {
  value: FlexiInterestCronjobFilterState;
  onFilterChange: (newFilter: FlexiInterestCronjobFilterState) => void;
}

const FlexiInterestFilterMenu: FC<FlexiInterestFilterMenuProps> = ({ value, onFilterChange }) => {
  const dispatch = useAppDispatch();
  const { filter: reduxFilter } = useAppSelector((state) => state.flexiInterestCronjob);

  const [localFilter, setLocalFilter] = useState<FlexiInterestCronjobFilterState>(() => ({
    status: value?.status || [],
    email: value?.email || [],
    membershipTier: value?.membershipTier || [],
    search: value?.search || null,
    updatedBy: value?.updatedBy || [],
    fromDate: value?.fromDate || null,
    toDate: value?.toDate || null,
  }));

  useEffect(() => {
    setLocalFilter({
      status: reduxFilter?.status || [],
      email: reduxFilter?.email || [],
      membershipTier: reduxFilter?.membershipTier || [],
      search: reduxFilter?.search || null,
      updatedBy: reduxFilter?.updatedBy || [],
      fromDate: reduxFilter?.fromDate || null,
      toDate: reduxFilter?.toDate || null,
    });
  }, [reduxFilter]);

  const isFilterApplied = useMemo(() => {
    return (
      (localFilter.status?.length ?? 0) > 0 ||
      (localFilter.email?.length ?? 0) > 0 ||
      (localFilter.membershipTier?.length ?? 0) > 0 ||
      (localFilter.updatedBy?.length ?? 0) > 0 ||
      localFilter.fromDate !== null ||
      localFilter.toDate !== null
    );
  }, [localFilter]);

  const handleLocalFilterChange = useCallback(
    (key: keyof FlexiInterestCronjobFilterState, newValue: any) => {
      setLocalFilter((prev) => ({
        ...prev,
        [key]: newValue,
      }));
    },
    [],
  );

  const handleApplyFilters = useCallback(() => {
    onFilterChange({
      ...initialLocalFilterState,
      ...localFilter,
    });
  }, [localFilter, onFilterChange]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setLocalFilter(initialLocalFilterState);
    dispatch(clearFilter());
  }, [dispatch]);

  const filterComponents: FilterComponentConfig[] = useMemo(
    () => [
      {
        key: 'status',
        component: (
          <MultiSelectFilter
            options={STATUS_OPTIONS}
            selectedValues={localFilter.status as string[]}
            onChange={(values) => handleLocalFilterChange('status', values)}
            label="Status"
            placeholder="Select status"
          />
        ),
        column: FilterColumn.LEFT,
        order: 0,
      },
      {
        key: 'email',
        component: (
          <MultiSelectFilter
            options={[]}
            selectedValues={localFilter.email as string[]}
            onChange={(values) => handleLocalFilterChange('email', values)}
            label="Email"
            placeholder="Select email"
          />
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'fromDate',
        component: (
          <div className="w-full max-w-full flex flex-col gap-2">
            <Label>From Date</Label>
            <DateTimePicker
              value={localFilter.fromDate as Date | undefined}
              onChange={(values) => handleLocalFilterChange('fromDate', values)}
            />
          </div>
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'membershipTier',
        component: (
          <MultiSelectFilter
            options={[]}
            selectedValues={localFilter.membershipTier as string[]}
            onChange={(values) => handleLocalFilterChange('membershipTier', values)}
            label="Membership Tier"
            placeholder="Select membership tier"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'updateBy',
        component: (
          <MultiSelectFilter
            options={[]}
            selectedValues={localFilter.updatedBy as string[]}
            onChange={(values) => handleLocalFilterChange('updatedBy', values)}
            label="Updated By"
            placeholder="Select user"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
      {
        key: 'toDate',
        component: (
          <div className="w-full max-w-full flex flex-col gap-2">
            <Label>To Date</Label>
            <DateTimePicker
              min={localFilter.fromDate as Date | undefined}
              value={localFilter.toDate as Date | undefined}
              onChange={(values) => handleLocalFilterChange('toDate', values)}
            />
          </div>
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
    ],
    [localFilter, handleLocalFilterChange],
  );

  return (
    <GlobalFilter
      filterParams={localFilter}
      filterComponents={filterComponents}
      onFilterChange={handleApplyFilters}
      currentFilter={localFilter}
      showFilterIcon={isFilterApplied}
      onResetFilter={handleResetFilters}
    />
  );
};

export default FlexiInterestFilterMenu;
