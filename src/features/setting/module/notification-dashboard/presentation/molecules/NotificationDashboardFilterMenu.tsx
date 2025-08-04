import DateRangeFilter from '@/components/common/filters/DateRangeFilter';
import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { NOTIFICATION_DASHBOARD_FILTER_CONSTANTS } from '../../data/constant';
import { clearFilter } from '../../slices';
import { NotificationDashboardFilterState } from '../../slices/types';

// Local filter state type for managing filter changes before applying
interface LocalFilterState {
  notifyType: string[];
  recipients: string[];
  sender: string[];
  notifyTo: string[];
  channel: string[];
  status: string[];
  search: string;
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
  const dispatch = useAppDispatch();
  const reduxFilter = useAppSelector((state) => state.notificationDashboard.filter);
  const filterOptions = useAppSelector((state) => state.notificationDashboard.filterOptions);

  // Local state for managing filter changes before applying
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
  }, [reduxFilter]);

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
      localFilter.notifyType.length > 0 ||
      localFilter.recipients.length > 0 ||
      localFilter.sender.length > 0 ||
      localFilter.notifyTo.length > 0 ||
      localFilter.channel.length > 0 ||
      localFilter.status.length > 0 ||
      localFilter.sendDateFrom !== null ||
      localFilter.sendDateTo !== null
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
      sendDateFrom: dateRange?.from || null,
      sendDateTo: dateRange?.to || null,
    }));
  }, []);

  // Apply filters to Redux state
  const handleApplyFilters = useCallback(() => {
    const newFilter: NotificationDashboardFilterState = {
      notifyType: localFilter.notifyType.length > 0 ? localFilter.notifyType : null,
      recipients: localFilter.recipients.length > 0 ? localFilter.recipients : null,
      sender: localFilter.sender.length > 0 ? localFilter.sender : null,
      notifyTo: localFilter.notifyTo.length > 0 ? (localFilter.notifyTo as any) : null,
      channel: localFilter.channel.length > 0 ? (localFilter.channel as any) : null,
      status: localFilter.status.length > 0 ? (localFilter.status as any) : null,
      search: localFilter.search || null,
      sendDateFrom: localFilter.sendDateFrom,
      sendDateTo: localFilter.sendDateTo,
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
                label: item,
                value: item,
              })) || []
            }
            selectedValues={localFilter.notifyType}
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
            selectedValues={localFilter.channel}
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
            selectedValues={localFilter.notifyTo}
            onChange={(values) => handleLocalFilterChange('notifyTo', values)}
            label="Notify To"
            placeholder="Select notify to"
          />
        ),
        column: FilterColumn.LEFT,
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
      {
        key: 'sender',
        component: (
          <MultiSelectFilter
            options={
              filterOptions?.sender.map((item) => ({
                label: item,
                value: item,
              })) || []
            }
            selectedValues={localFilter.sender}
            onChange={(values) => handleLocalFilterChange('sender', values)}
            label="Sender"
            placeholder="Select sender"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 1,
      },
      {
        key: 'recipients',
        component: (
          <MultiSelectFilter
            options={
              filterOptions?.recipient.map((item) => ({
                label: item,
                value: item,
              })) || []
            }
            selectedValues={localFilter.recipients}
            onChange={(values) => handleLocalFilterChange('recipients', values)}
            label="Recipients"
            placeholder="Select recipients"
          />
        ),
        column: FilterColumn.RIGHT,
        order: 2,
      },
    ],
    [localFilter, dateRange, handleLocalFilterChange, handleDateRangeChange, filterOptions],
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

export default NotificationDashboardFilterMenu;
