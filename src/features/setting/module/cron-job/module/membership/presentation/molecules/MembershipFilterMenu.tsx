import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { membershipCronjobContainer } from '../../di/membershipCronjobDashboardDI';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IGetMembershipTiersUseCase } from '../../domain/usecase/GetMembershipTiersUseCase';
import { IGetMembershipUsersUseCase } from '../../domain/usecase/GetMembershipUsersUseCase';
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
  { value: 'SUCCESSFUL', label: 'SUCCESSFUL' },
  { value: 'FAIL', label: 'FAIL' },
];

// Dynamic tier options fetched from API
const PAGE_SIZE = 20;

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

  const [tierOptions, setTierOptions] = useState<{ value: string; label: string }[]>([]);
  const [emailOptions, setEmailOptions] = useState<{ value: string; label: string }[]>([]);
  const [updatedByOptions, setUpdatedByOptions] = useState<{ value: string; label: string }[]>([]);
  const [tierPage, setTierPage] = useState(1);
  const [tierHasMore, setTierHasMore] = useState(true);
  const [tierLoadingMore, setTierLoadingMore] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userHasMore, setUserHasMore] = useState(true);
  const [userLoadingMore, setUserLoadingMore] = useState(false);

  // Do not prefetch options on mount; fetch lazily on dropdown open

  const handleLoadMoreTiers = useCallback(async () => {
    if (!tierHasMore || tierLoadingMore) return;
    setTierLoadingMore(true);
    const next = tierPage + 1;
    try {
      const useCase = membershipCronjobContainer.get<IGetMembershipTiersUseCase>(
        MEMBERSHIP_CRONJOB_TYPES.IGetMembershipTiersUseCase,
      );
      const res = await useCase.execute(next, PAGE_SIZE);
      const items = res.data?.items || [];
      const options = items.map((t) => ({ value: t.id, label: t.tierName }));
      setTierOptions((prev) => [...prev, ...options]);
      setTierHasMore(Boolean(res.data?.hasMore));
      setTierPage(next);
    } finally {
      setTierLoadingMore(false);
    }
  }, [tierHasMore, tierLoadingMore, tierPage]);

  const handleLoadMoreUsers = useCallback(async () => {
    if (!userHasMore || userLoadingMore) return;
    setUserLoadingMore(true);
    const next = userPage + 1;
    try {
      const useCase = membershipCronjobContainer.get<IGetMembershipUsersUseCase>(
        MEMBERSHIP_CRONJOB_TYPES.IGetMembershipUsersUseCase,
      );
      const res = await useCase.execute(next, PAGE_SIZE);
      const items = res.data?.items || [];
      const emailOpts = items.map((u) => ({ value: u.email, label: u.email }));
      const updatedByOpts = items.map((u) => ({ value: u.id, label: u.email }));
      setEmailOptions((prev) => [...prev, ...emailOpts]);
      setUpdatedByOptions((prev) => [...prev, ...updatedByOpts]);
      setUserHasMore(Boolean(res.data?.hasMore));
      setUserPage(next);
    } finally {
      setUserLoadingMore(false);
    }
  }, [userHasMore, userLoadingMore, userPage]);

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
            options={tierOptions}
            selectedValues={localFilter.fromTier}
            onChange={(values) => handleLocalFilterChange('fromTier', values)}
            label="From Tier"
            placeholder="Select from tier"
            onScrollEnd={handleLoadMoreTiers}
            hasMore={tierHasMore}
            isLoadingMore={tierLoadingMore}
            onOpenChange={(open) => {
              if (open && tierOptions.length === 0 && !tierLoadingMore) {
                setTierPage(1);
                setTierHasMore(true);
                setTierOptions([]);
                (async () => {
                  setTierLoadingMore(true);
                  try {
                    const useCase = membershipCronjobContainer.get<IGetMembershipTiersUseCase>(
                      MEMBERSHIP_CRONJOB_TYPES.IGetMembershipTiersUseCase,
                    );
                    const res = await useCase.execute(1, PAGE_SIZE);
                    const items = res.data?.items || [];
                    setTierOptions(items.map((t) => ({ value: t.id, label: t.tierName })));
                    setTierHasMore(Boolean(res.data?.hasMore));
                  } finally {
                    setTierLoadingMore(false);
                  }
                })();
              }
            }}
          />
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'toTier',
        component: (
          <MultiSelectFilter
            options={tierOptions}
            selectedValues={localFilter.toTier}
            onChange={(values) => handleLocalFilterChange('toTier', values)}
            label="To Tier"
            placeholder="Select to tier"
            onScrollEnd={handleLoadMoreTiers}
            hasMore={tierHasMore}
            isLoadingMore={tierLoadingMore}
            onOpenChange={(open) => {
              if (open && tierOptions.length === 0 && !tierLoadingMore) {
                setTierPage(1);
                setTierHasMore(true);
                setTierOptions([]);
                (async () => {
                  setTierLoadingMore(true);
                  try {
                    const useCase = membershipCronjobContainer.get<IGetMembershipTiersUseCase>(
                      MEMBERSHIP_CRONJOB_TYPES.IGetMembershipTiersUseCase,
                    );
                    const res = await useCase.execute(1, PAGE_SIZE);
                    const items = res.data?.items || [];
                    setTierOptions(items.map((t) => ({ value: t.id, label: t.tierName })));
                    setTierHasMore(Boolean(res.data?.hasMore));
                  } finally {
                    setTierLoadingMore(false);
                  }
                })();
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
        key: 'email',
        component: (
          <MultiSelectFilter
            options={emailOptions}
            selectedValues={localFilter.email}
            onChange={(values) => handleLocalFilterChange('email', values)}
            label="Email"
            placeholder="Select email"
            onScrollEnd={handleLoadMoreUsers}
            hasMore={userHasMore}
            isLoadingMore={userLoadingMore}
            onOpenChange={(open) => {
              if (open && emailOptions.length === 0 && !userLoadingMore) {
                setUserPage(1);
                setUserHasMore(true);
                setEmailOptions([]);
                setUpdatedByOptions([]);
                (async () => {
                  setUserLoadingMore(true);
                  try {
                    const useCase = membershipCronjobContainer.get<IGetMembershipUsersUseCase>(
                      MEMBERSHIP_CRONJOB_TYPES.IGetMembershipUsersUseCase,
                    );
                    const res = await useCase.execute(1, PAGE_SIZE);
                    const items = res.data?.items || [];
                    setEmailOptions(items.map((u) => ({ value: u.email, label: u.email })));
                    setUpdatedByOptions(items.map((u) => ({ value: u.id, label: u.email })));
                    setUserHasMore(Boolean(res.data?.hasMore));
                  } finally {
                    setUserLoadingMore(false);
                  }
                })();
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
            onScrollEnd={handleLoadMoreUsers}
            hasMore={userHasMore}
            isLoadingMore={userLoadingMore}
            onOpenChange={(open) => {
              if (open && updatedByOptions.length === 0 && !userLoadingMore) {
                setUserPage(1);
                setUserHasMore(true);
                setEmailOptions([]);
                setUpdatedByOptions([]);
                (async () => {
                  setUserLoadingMore(true);
                  try {
                    const useCase = membershipCronjobContainer.get<IGetMembershipUsersUseCase>(
                      MEMBERSHIP_CRONJOB_TYPES.IGetMembershipUsersUseCase,
                    );
                    const res = await useCase.execute(1, PAGE_SIZE);
                    const items = res.data?.items || [];
                    setEmailOptions(items.map((u) => ({ value: u.email, label: u.email })));
                    setUpdatedByOptions(items.map((u) => ({ value: u.id, label: u.email })));
                    setUserHasMore(Boolean(res.data?.hasMore));
                  } finally {
                    setUserLoadingMore(false);
                  }
                })();
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
      tierOptions,
      emailOptions,
      updatedByOptions,
      tierHasMore,
      tierLoadingMore,
      userHasMore,
      userLoadingMore,
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

export default MembershipFilterMenu;
