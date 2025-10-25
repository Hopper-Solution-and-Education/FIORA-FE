import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import CommonTable from '@/components/common/organisms/CommonTable';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { Icons } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/shared/constants/userRole';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { setNotificationDashboardFilter } from '../../slices';
import { NotificationDashboardFilterState } from '../../slices/types';
import NotificationActionButton from '../atoms/NotificationActionButton';
import NotificationChannelBadge from '../atoms/NotificationChannelBadge';
import NotificationRecipientsCell from '../atoms/NotificationRecipientsCell';
import NotificationStatusBadge from '../atoms/NotificationStatusBadge';
import NotificationTypeBadge from '../atoms/NotificationTypeBadge';
import NotificationDashboardFilterMenu from '../molecules/NotificationDashboardFilterMenu';
import NotificationDashboardSearch from '../molecules/NotificationDashboardSearch';
import { NotificationDashboardTableData } from '../types/setting.type';

type NotificationDashboardTableDataWithIndex = NotificationDashboardTableData & {
  rowIndex: number;
};

interface Props {
  data: NotificationDashboardTableData[];
  loading: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

const STORAGE_KEY = 'notification-dashboard:common-table';

const NotificationDashboardCommonTable = ({
  data,
  loading,
  hasMore,
  isLoadingMore,
  onLoadMore,
  className,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();

  const isSettingDashboard = !!path?.includes('setting');
  const SETTING_COLUMN = isSettingDashboard ? [] : ['Recipients', 'Sender'];

  // Get current filter state from Redux store
  const filter = useAppSelector((state) => state.notificationDashboard.filter);

  // Handle filter changes and dispatch to Redux store
  const handleFilterChange = useCallback(
    (newFilter: NotificationDashboardFilterState) => {
      dispatch(setNotificationDashboardFilter(newFilter));
    },
    [dispatch],
  );

  // Left header node: Search and filter controls
  const leftHeaderNode = (
    <div className="flex items-center gap-2">
      <NotificationDashboardSearch />
      <NotificationDashboardFilterMenu value={filter} onFilterChange={handleFilterChange} />
    </div>
  );

  // Right header node: Column management and actions
  const rightHeaderNode = (
    <div className="flex items-center gap-2">
      <CommonTooltip content="Create Email Template">
        <Button
          onClick={() => {
            router.push('/setting/notification/email-template');
          }}
          variant="outline"
          size="icon"
          className="rounded-md hover:bg-accent hover:text-accent-foreground px-5 transition-colors"
        >
          <Icons.mail className="w-5 h-5" />
        </Button>
      </CommonTooltip>
    </div>
  );

  // Create a custom data with index for the No. column
  const dataWithIndex = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      rowIndex: index + 1,
    }));
  }, [data]);

  const columns: CommonTableColumn<NotificationDashboardTableDataWithIndex>[] = useMemo(() => {
    const baseColumns: CommonTableColumn<NotificationDashboardTableDataWithIndex>[] = [
      {
        key: 'no',
        title: 'No.',
        align: 'center',
        width: '5%',
        render: (r) => (
          <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
            {r.rowIndex}
          </span>
        ),
      },
      {
        key: 'sendDate',
        title: 'Send Date',
        align: 'left',
        width: '12%',
        render: (r) => formatDateTime(r.sendDate),
      },
      {
        key: 'notifyTo',
        title: 'Notify To',
        align: 'center',
        width: '10%',
        render: (r) => (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {r.notifyTo}
          </Badge>
        ),
      },
      {
        key: 'subject',
        title: 'Subject',
        align: 'left',
        width: '18%',
        render: (r) => r.subject,
      },
      {
        key: 'recipients',
        title: 'Recipients',
        align: 'left',
        width: '15%',
        render: (r) => <NotificationRecipientsCell recipients={r.recipients} />,
      },
      {
        key: 'sender',
        title: 'Sender',
        align: 'left',
        width: '12%',
        render: (r) => r.sender,
      },
      {
        key: 'notifyType',
        title: 'Notify Type',
        align: 'center',
        width: '10%',
        render: (r) => <NotificationTypeBadge notifyType={r.notifyType} />,
      },
      {
        key: 'channel',
        title: 'Channel',
        align: 'center',
        width: '8%',
        render: (r) => <NotificationChannelBadge channel={r.channel} />,
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        width: '8%',
        render: (r) => <NotificationStatusBadge status={r.status} />,
      },
      {
        key: 'action',
        title: 'Action',
        align: 'center',
        width: '12%',
        render: (r) => <NotificationActionButton notificationData={r} />,
      },
    ];

    // Hide Notify To and Status columns if user role is 'User'
    const userRole = session?.user?.role;
    if (userRole === UserRole.USER) {
      return baseColumns.filter((col) => col.key !== 'notifyTo' && col.key !== 'status');
    }

    return baseColumns;
  }, [session]);

  // Filter columns based on setting dashboard context
  const filteredColumns = useMemo(() => {
    return columns.filter((col) => !SETTING_COLUMN.includes(col.title as string));
  }, [columns, SETTING_COLUMN]);

  const initialConfig: ColumnConfigMap = useMemo(() => {
    return filteredColumns.reduce((acc, c, idx) => {
      if (c.key) {
        acc[c.key as string] = {
          isVisible: true,
          index: idx,
          alignOverride: c.align,
        };
      }
      return acc;
    }, {} as ColumnConfigMap);
  }, [filteredColumns]);

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(initialConfig);

  return (
    <CommonTable
      data={dataWithIndex}
      columns={filteredColumns}
      columnConfig={columnConfig}
      onColumnConfigChange={setColumnConfig}
      storageKey={STORAGE_KEY}
      loading={loading}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={onLoadMore}
      className={className}
      leftHeaderNode={leftHeaderNode}
      rightHeaderNode={rightHeaderNode}
    />
  );
};

export default NotificationDashboardCommonTable;
