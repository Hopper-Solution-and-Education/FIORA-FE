import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import NotificationActionButton from '../atoms/NotificationActionButton';
import NotificationChannelBadge from '../atoms/NotificationChannelBadge';
import NotificationRecipientsPopover from '../atoms/NotificationRecipientsPopover';
import NotificationStatusBadge from '../atoms/NotificationStatusBadge';
import NotificationTypeBadge from '../atoms/NotificationTypeBadge';
import { NotificationDashboardTableData } from '../types/setting.type';

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
        switch (col) {
          case 'No.':
            return (
              <TableCell
                key={col}
                className="text-center font-semibold text-blue-600 dark:text-blue-400"
              >
                {index + 1}
              </TableCell>
            );
          case 'Send Date':
            return (
              <TableCell key={col} className="text-center truncate max-w-[180px]">
                {formatDateTime(data.sendDate)}
              </TableCell>
            );
          case 'Notify To': {
            return (
              <TableCell key={col} className="text-center">
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
                className="text-left max-w-[180px] truncate"
                title={data.subject}
              >
                {data.subject}
              </TableCell>
            );
          case 'Recipients':
            return (
              <TableCell key={col} className="text-center">
                <NotificationRecipientsPopover recipients={data.recipients}>
                  <span className="underline underline-offset-2 cursor-pointer">
                    {typeof data.recipients === 'string'
                      ? data.recipients
                      : `${data.recipients.length} emails`}
                  </span>
                </NotificationRecipientsPopover>
              </TableCell>
            );
          case 'Sender':
            return (
              <TableCell key={col} className="text-center">
                {data.sender}
              </TableCell>
            );
          case 'Notify Type':
            return (
              <TableCell key={col} className="text-center">
                <NotificationTypeBadge notifyType={data.notifyType} />
              </TableCell>
            );
          case 'Channel':
            return (
              <TableCell key={col} className="text-center">
                <NotificationChannelBadge channel={data.channel} />
              </TableCell>
            );
          case 'Status':
            return (
              <TableCell key={col} className="text-center">
                <NotificationStatusBadge status={data.status} />
              </TableCell>
            );
          case 'Action':
            return (
              <TableCell key={col} className="text-center">
                <NotificationActionButton notificationId={data.id} />
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
