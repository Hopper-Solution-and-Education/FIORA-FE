import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import NotificationActionButton from '../atoms/NotificationActionButton';
import NotificationChannelBadge from '../atoms/NotificationChannelBadge';
import NotificationRecipientsCell from '../atoms/NotificationRecipientsCell';
import NotificationStatusBadge from '../atoms/NotificationStatusBadge';
import NotificationTypeBadge from '../atoms/NotificationTypeBadge';
import { NotificationDashboardTableData } from '../types/setting.type';
import { getAlignClass } from '../utils/convertTableUtils';

interface NotificationDashboardTableRowProps {
  data: NotificationDashboardTableData;
  columns: string[];
  index: number;
}

const NotificationDashboardTableRow = ({
  data,
  columns,
  index,
}: NotificationDashboardTableRowProps) => {
  return (
    <TableRow className="transition-colors">
      {columns.map((col) => {
        const alignClass = getAlignClass(col);

        switch (col) {
          case 'No.':
            return (
              <TableCell
                key={col}
                className={`font-semibold text-blue-600 dark:text-blue-400 ${alignClass}`}
              >
                {index + 1}
              </TableCell>
            );
          case 'Send Date':
            return (
              <TableCell key={col} className={`truncate max-w-[180px] ${alignClass}`}>
                {formatDateTime(data.sendDate)}
              </TableCell>
            );
          case 'Notify To': {
            return (
              <TableCell key={col} className={alignClass}>
                <Badge
                  variant="secondary"
                  className={`hover:bg-blue-100 bg-blue-100 text-blue-700`}
                >
                  {data.notifyTo}
                </Badge>
              </TableCell>
            );
          }
          case 'Subject':
            return (
              <TableCell
                key={col}
                className={`max-w-[180px] truncate ${alignClass}`}
                title={data.subject}
              >
                {data.subject}
              </TableCell>
            );
          case 'Recipients':
            return (
              <TableCell key={col} className={alignClass}>
                <NotificationRecipientsCell recipients={data.recipients} />
              </TableCell>
            );
          case 'Sender':
            return (
              <TableCell key={col} className={alignClass}>
                {data.sender}
              </TableCell>
            );
          case 'Notify Type':
            return (
              <TableCell key={col} className={alignClass}>
                <NotificationTypeBadge notifyType={data.notifyType} />
              </TableCell>
            );
          case 'Channel':
            return (
              <TableCell key={col} className={alignClass}>
                <NotificationChannelBadge channel={data.channel} />
              </TableCell>
            );
          case 'Status':
            return (
              <TableCell key={col} className={alignClass}>
                <NotificationStatusBadge status={data.status} />
              </TableCell>
            );
          case 'Action':
            return (
              <TableCell key={col} className={alignClass}>
                <NotificationActionButton notificationData={data} />
              </TableCell>
            );
          default:
            return null;
        }
      })}
    </TableRow>
  );
};

export default NotificationDashboardTableRow;
