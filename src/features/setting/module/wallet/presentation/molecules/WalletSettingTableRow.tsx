import { TableCell, TableRow } from '@/components/ui/table';
import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import {
  UserProfileCard,
  WalletSettingActionButton,
  WalletSettingAttachmentLink,
  WalletSettingStatusBadge,
} from '../atoms';
import { WalletSettingTableData } from '../types';

interface WalletSettingTableRowProps {
  data: WalletSettingTableData;
  columns: string[];
}

const WalletSettingTableRow = ({ data, columns }: WalletSettingTableRowProps) => {
  return (
    <TableRow>
      {columns.map((col) => {
        switch (col) {
          case 'Request Code':
            return (
              <TableCell
                key={col}
                className="font-medium text-blue-600 dark:text-blue-400 text-center cursor-pointer"
              >
                {data.refCode}
              </TableCell>
            );
          case 'Requester':
            return (
              <TableCell key={col} className="text-left max-w-[180px]">
                <UserProfileCard user={data.user} userId={data.userId} />
              </TableCell>
            );
          case 'Amount':
            return (
              <TableCell key={col} className="text-center">
                {formatFIORACurrency(data.fxAmount, 'FX')}
              </TableCell>
            );
          case 'Request Date':
            return (
              <TableCell key={col} className="text-center">
                {formatDateTime(data.createdAt)}
              </TableCell>
            );
          case 'Attachment':
            return (
              <TableCell key={col} className="text-center">
                <WalletSettingAttachmentLink attachment={data.attachment} />
              </TableCell>
            );
          case 'Status':
            return (
              <TableCell key={col} className="text-center">
                <WalletSettingStatusBadge status={data.status} />
              </TableCell>
            );
          case 'Action':
            return (
              <TableCell key={col} className="text-center">
                <WalletSettingActionButton status={data.status} id={data.id} />
              </TableCell>
            );
          default:
            return null;
        }
      })}
    </TableRow>
  );
};

export default WalletSettingTableRow;
