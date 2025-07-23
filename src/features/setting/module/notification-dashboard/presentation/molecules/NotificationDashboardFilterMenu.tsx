import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import SelectFilter from '@/components/common/filters/SelectFilter';
import { FilterColumn, FilterComponentConfig } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearFilter } from '../../slices';

const STATUS_OPTIONS = [
  { value: 'Success', label: 'Success' },
  { value: 'Failed', label: 'Failed' },
];
const NOTIFY_TYPE_OPTIONS = [
  { value: 'Support', label: 'Support' },
  { value: 'Deposit', label: 'Deposit' },
  { value: 'MemberShip', label: 'MemberShip' },
  { value: 'Referral Bonus', label: 'Referral Bonus' },
  { value: 'eKYC', label: 'eKYC' },
];
const CHANNEL_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'BOX', label: 'Box' },
];

interface NotificationDashboardFilterMenuProps {
  value: any;
  onFilterChange: (newFilter: any) => void;
  onApply: () => void;
}

const NotificationDashboardFilterMenu = ({
  value,
  onFilterChange,
  onApply,
}: NotificationDashboardFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.notificationDashboard.filter);

  const isFilterApplied = Object.entries(filter || {}).some(
    ([k, v]) => v !== null && v !== '' && v !== 'all' && k !== 'search',
  );

  const filterComponents: FilterComponentConfig[] = [
    {
      key: 'status',
      component: (
        <MultiSelectFilter
          options={STATUS_OPTIONS}
          selectedValues={
            Array.isArray(value.status) ? value.status : value.status ? [value.status] : []
          }
          onChange={(values) => onFilterChange({ ...value, status: values })}
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
        <SelectFilter
          options={NOTIFY_TYPE_OPTIONS}
          value={value.notifyType || ''}
          onChange={(v) => onFilterChange({ ...value, notifyType: v })}
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
        <SelectFilter
          options={CHANNEL_OPTIONS}
          value={value.channel || ''}
          onChange={(v) => onFilterChange({ ...value, channel: v })}
          label="Channel"
          placeholder="Select channel"
        />
      ),
      column: FilterColumn.LEFT,
      order: 2,
    },
  ];

  return (
    <GlobalFilter
      filterParams={value}
      filterComponents={filterComponents}
      onFilterChange={onApply}
      currentFilter={value}
      onResetFilter={() => dispatch(clearFilter())}
      showFilterIcon={isFilterApplied}
    />
  );
};

export default NotificationDashboardFilterMenu;
