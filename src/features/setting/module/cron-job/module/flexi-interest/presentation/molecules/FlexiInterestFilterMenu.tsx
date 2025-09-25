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
  tierName: [],
  search: null,
  emailUpdateBy: [],
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
  dataOptions: any;
}

const FlexiInterestFilterMenu: FC<FlexiInterestFilterMenuProps> = ({
  value,
  onFilterChange,
  dataOptions,
}) => {
  const dispatch = useAppDispatch();
  const { filter: reduxFilter } = useAppSelector((state) => state.flexiInterestCronjob);

  const [localFilter, setLocalFilter] = useState<FlexiInterestCronjobFilterState>(() => ({
    status: value?.status || [],
    email: value?.email || [],
    tierName: value?.tierName || [],
    search: value?.search || null,
    updatedBy: value?.emailUpdateBy || [],
    fromDate: value?.fromDate || null,
    toDate: value?.toDate || null,
  }));

  const membershipTierOptions = useMemo(() => {
    if (!dataOptions?.tierNameOptions) return [];
    // console.log('membershipTierData:', membershipTierData )

    return dataOptions?.tierNameOptions?.map((tier: any) => ({
      value: tier.id,
      label: tier.tierName,
    }));
  }, [dataOptions]);

  const emailOptions = useMemo(() => {
    if (!dataOptions?.emailOptions) return [];

    return dataOptions?.emailOptions?.map((item: any) => ({
      value: item?.id,
      label: item?.email,
    }));
  }, [dataOptions]);

  const updateByOptions = useMemo(() => {
    if (!dataOptions?.updateByOptions) return [];

    return dataOptions?.updateByOptions?.map((item: any) => ({
      value: item?.id,
      label: item?.email,
    }));
  }, [dataOptions]);

  useEffect(() => {
    setLocalFilter({
      status: reduxFilter?.status || [],
      email: reduxFilter?.email || [],
      tierName: reduxFilter?.tierName || [],
      search: reduxFilter?.search || null,
      emailUpdateBy: reduxFilter?.emailUpdateBy || [],
      fromDate: reduxFilter?.fromDate || null,
      toDate: reduxFilter?.toDate || null,
    });
  }, [reduxFilter]);

  const isFilterApplied = useMemo(() => {
    return (
      (reduxFilter.status?.length ?? 0) > 0 ||
      (reduxFilter.email?.length ?? 0) > 0 ||
      (reduxFilter.tierName?.length ?? 0) > 0 ||
      (reduxFilter.emailUpdateBy?.length ?? 0) > 0 ||
      reduxFilter.fromDate !== null ||
      reduxFilter.toDate !== null
    );
  }, [reduxFilter]);

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
    setLocalFilter({
      ...initialLocalFilterState,
      fromDate: null,
      toDate: null,
    });
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
            options={emailOptions}
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
              hideTime
              max={(localFilter.toDate as Date | undefined) ?? undefined}
              value={(localFilter.fromDate as Date | undefined) ?? undefined}
              onChange={(values) => handleLocalFilterChange('fromDate', values)}
              onDayClick={(values) => handleLocalFilterChange('fromDate', values)}
            />
          </div>
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'tierName',
        component: (
          <MultiSelectFilter
            options={membershipTierOptions}
            selectedValues={localFilter.tierName as string[]}
            onChange={(values) => handleLocalFilterChange('tierName', values)}
            label="Membership Tier"
            placeholder="Select membership tier"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 0,
      },
      {
        key: 'emailUpdateBy',
        component: (
          <MultiSelectFilter
            options={updateByOptions}
            selectedValues={localFilter.emailUpdateBy as string[]}
            onChange={(values) => handleLocalFilterChange('emailUpdateBy', values)}
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
              hideTime
              min={(localFilter.fromDate as Date | undefined) ?? undefined}
              value={(localFilter.toDate as Date | undefined) ?? undefined}
              onChange={(values) => handleLocalFilterChange('toDate', values)}
              onDayClick={(values) => handleLocalFilterChange('toDate', values)}
            />
          </div>
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
    ],
    [localFilter, handleLocalFilterChange, membershipTierOptions],
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
