import { TableCell, TableRow } from '@/components/ui/table';
import NotificationActionButton from '../atoms/NotificationActionButton';
import NotificationChannelBadge from '../atoms/NotificationChannelBadge';
import NotificationRecipientsCell from '../atoms/NotificationRecipientsCell';
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
    <TableRow>
      {columns.map((col) => {
        switch (col) {
          case 'No.':
            return (
              <TableCell key={col} className="text-center">
                {index + 1}
              </TableCell>
            );
          case 'Send Date':
            return (
              <TableCell key={col} className="text-center">
                {data.sendDate}
              </TableCell>
            );
          case 'Notify To':
            return (
              <TableCell key={col} className="text-center">
                {data.notifyTo}
              </TableCell>
            );
          case 'Subject':
            return (
              <TableCell key={col} className="text-left">
                {data.subject}
              </TableCell>
            );
          case 'Recipients':
            return (
              <TableCell key={col} className="text-center">
                <NotificationRecipientsCell recipients={data.recipients} />
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
                <NotificationActionButton />
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
