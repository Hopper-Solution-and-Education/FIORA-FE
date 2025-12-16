import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types';
import { formatUnderlineString } from '@/shared/utils/stringHelper';
import { useAppDispatch, useAppSelector } from '@/store';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { NOTIFICATION_DASHBOARD_FILTER_CONSTANTS } from '../../data/constant';
import { ChannelType, NotificationTo } from '../../domain';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';
import { clearFilter } from '../../slices';
import { NotificationDashboardFilterState } from '../../slices/types';

// Local filter state type for managing filter changes before applying
interface LocalFilterState {
  notifyType?: string[] | null;
  recipients?: string[] | null;
  sender?: string[] | null;
  notifyTo?: NotificationTo[] | null;
  channel?: ChannelType[] | null;
  status?: NotificationLogType[] | null;
  search?: string | null;
  sendDateFrom: Date | null;
  sendDateTo: Date | null;
}

// Initialize local filter state
const getInitialLocalFilterState = (): LocalFilterState => ({
  notifyType: [],
  recipients: [],
  sender: [],
  notifyTo: [],
  channel: [],
  status: [],
  search: '',
  sendDateFrom: null,
  sendDateTo: null,
});

interface NotificationDashboardFilterMenuProps {
  value: NotificationDashboardFilterState;
  onFilterChange: (newFilter: NotificationDashboardFilterState) => void;
}

const NotificationDashboardFilterMenu = ({
  value,
  onFilterChange,
}: NotificationDashboardFilterMenuProps) => {
  const path = usePathname();
  const isSettingDashboard = !!path?.includes('setting');
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.notificationDashboard.filter);
  const filterOptions = useAppSelector((state) => state.notificationDashboard.filterOptions);

  // LOCAL STATE
  const [localFilter, setLocalFilter] = useState<LocalFilterState>(() => {
    // Initialize local filter from Redux state
    return {
      notifyType: value.notifyType || [],
      recipients: value.recipients || [],
      sender: value.sender || [],
      notifyTo: value.notifyTo || [],
      channel: value.channel || [],
      status: value.status || [],
      search: value.search || '',
      sendDateFrom: value.sendDateFrom,
      sendDateTo: value.sendDateTo,
    };
  });

  // Convert date range to individual dates for API
  const dateRange: DateRange | undefined = useMemo(() => {
    if (localFilter.sendDateFrom || localFilter.sendDateTo) {
      return {
        from: localFilter.sendDateFrom || undefined,
        to: localFilter.sendDateTo || undefined,
      };
    }
    return undefined;
  }, [localFilter.sendDateFrom, localFilter.sendDateTo]);

  // Check if any filter is applied (excluding search)
  const isFilterApplied = useMemo(() => {
    return (
      (localFilter.notifyType && localFilter.notifyType.length > 0) ||
      (localFilter.recipients && localFilter.recipients.length > 0) ||
      (localFilter.sender && localFilter.sender.length > 0) ||
      (localFilter.notifyTo && localFilter.notifyTo.length > 0) ||
      (localFilter.channel && localFilter.channel.length > 0 && isSettingDashboard) ||
      (localFilter.status && localFilter.status.length > 0) ||
      localFilter.sendDateFrom !== null ||
      localFilter.sendDateTo !== null
    );
  }, [localFilter]);

  // FUNCTIONS
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
      sendDateFrom: dateRange?.from || null,
      sendDateTo: dateRange?.to || null,
    }));
  }, []);

  // Apply filters to Redux state
  const handleApplyFilters = useCallback(() => {
    const newFilter: NotificationDashboardFilterState = {
      notifyType:
        localFilter.notifyType && localFilter.notifyType?.length > 0
          ? localFilter.notifyType
          : null,
      recipients:
        localFilter.recipients && localFilter.recipients?.length > 0
          ? localFilter.recipients
          : null,
      sender: localFilter.sender && localFilter.sender?.length > 0 ? localFilter.sender : null,
      notifyTo:
        localFilter.notifyTo && localFilter.notifyTo.length > 0
          ? (localFilter.notifyTo as any)
          : null,
      channel: localFilter.channel && localFilter.channel.length > 0 ? localFilter.channel : null,
      status:
        localFilter.status && localFilter.status.length > 0 ? (localFilter.status as any) : null,
      search: localFilter.search || null,
      sendDateFrom: localFilter.sendDateFrom,
      sendDateTo: localFilter.sendDateTo,
    };

    onFilterChange(newFilter);
  }, [localFilter, onFilterChange]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const initialLocalFilterState = getInitialLocalFilterState();
    setLocalFilter(initialLocalFilterState);
    dispatch(clearFilter());
  }, [dispatch]);

  // UI ZONE
  // Filter components configuration
  const defaultFilterComponents: FilterComponentConfig[] = useMemo(
    () => [
      {
        key: 'status',
        component: (
          <MultiSelectFilter
            options={NOTIFICATION_DASHBOARD_FILTER_CONSTANTS.STATUS_OPTIONS}
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
        key: 'notifyType',
        component: (
          <MultiSelectFilter
            options={
              filterOptions?.notifyType.map((item) => ({
                label: formatUnderlineString(item),
                value: item,
              })) || []
            }
            selectedValues={localFilter?.notifyType}
            onChange={(values) => handleLocalFilterChange('notifyType', values)}
            label="Notify Type"
            placeholder="Select notify type"
          />
        ),
        column: FilterColumn.LEFT,
        order: 1,
      },
      {
        key: 'channel',
        component: (
          <MultiSelectFilter
            options={NOTIFICATION_DASHBOARD_FILTER_CONSTANTS.CHANNEL_OPTIONS}
            selectedValues={localFilter?.channel}
            onChange={(values) => handleLocalFilterChange('channel', values)}
            label="Channel"
            placeholder="Select channel"
          />
        ),
        column: FilterColumn.LEFT,
        order: 2,
      },
      {
        key: 'notifyTo',
        component: (
          <MultiSelectFilter
            options={NOTIFICATION_DASHBOARD_FILTER_CONSTANTS.NOTIFY_TO_OPTIONS}
            selectedValues={localFilter?.notifyTo}
            onChange={(values) => handleLocalFilterChange('notifyTo', values)}
            label="Notify To"
            placeholder="Select notify to"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 3,
      },
      {
        key: 'dateRange',
        component: (
          <DateRangeFilter
            dateRange={dateRange}
            onChange={handleDateRangeChange}
            label="Send Date Range"
            colorScheme="default"
            disableFuture={true}
            pastDaysLimit={365} // Allow filtering up to 1 year ago
          />
        ),
        column: FilterColumn.RIGHT,
        order: 0,
      },
    ],
    [localFilter, dateRange, handleLocalFilterChange, handleDateRangeChange, filterOptions],
  );

  const filterComponents = useMemo(() => {
    if (isSettingDashboard) {
      return defaultFilterComponents;
    }
    return defaultFilterComponents.filter(
      (item) => item.key !== 'notifyTo' && item.key !== 'channel' && item.key !== 'status',
    );
  }, [defaultFilterComponents, isSettingDashboard]);

  // EFFECTS ZONE
  // Sync local filter with Redux state changes
  useEffect(() => {
    setLocalFilter({
      notifyType: reduxFilter.notifyType || [],
      recipients: reduxFilter.recipients || [],
      sender: reduxFilter.sender || [],
      notifyTo: reduxFilter.notifyTo || [],
      channel: reduxFilter.channel || [],
      status: reduxFilter.status || [],
      search: reduxFilter.search || '',
      sendDateFrom: reduxFilter.sendDateFrom,
      sendDateTo: reduxFilter.sendDateTo,
    });

    return () => {
      dispatch(clearFilter());
    };
  }, [reduxFilter]);

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

export default NotificationDashboardFilterMenu;
