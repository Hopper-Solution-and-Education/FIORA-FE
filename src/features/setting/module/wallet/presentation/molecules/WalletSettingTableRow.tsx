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
import { WALLET_SETTING_TABLE_COLUMN_CONFIG } from '../types/setting.type';

interface WalletSettingTableRowProps {
  data: WalletSettingTableData;
  columns: string[];
}

const WalletSettingTableRow = ({ data, columns }: WalletSettingTableRowProps) => {
  const getAlignClass = (col: string) => {
    const side =
      WALLET_SETTING_TABLE_COLUMN_CONFIG[col as keyof typeof WALLET_SETTING_TABLE_COLUMN_CONFIG]
        ?.side || 'center';
    switch (side) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  return (
    <TableRow>
      {columns.map((col) => {
        const alignClass = getAlignClass(col);

        switch (col) {
          case 'Request Code':
            return (
              <TableCell
                key={col}
                className={`font-medium text-blue-600 dark:text-blue-400 cursor-pointer ${alignClass}`}
              >
                {data.refCode}
              </TableCell>
            );
          case 'Requester':
            return (
              <TableCell key={col} className={`max-w-[180px] ${alignClass}`}>
                <UserProfileCard user={data.user} userId={data.userId} />
              </TableCell>
            );
          case 'Amount':
            return (
              <TableCell key={col} className={alignClass}>
                {formatFIORACurrency(data.fxAmount, 'FX')}
              </TableCell>
            );
          case 'Request Date':
            return (
              <TableCell key={col} className={alignClass}>
                {formatDateTime(data.createdAt)}
              </TableCell>
            );
          case 'Attachment':
            return (
              <TableCell key={col} className={alignClass}>
                <WalletSettingAttachmentLink attachment={data.attachment} />
              </TableCell>
            );
          case 'Status':
            return (
              <TableCell key={col} className={alignClass}>
                <WalletSettingStatusBadge status={data.status} />
              </TableCell>
            );
          case 'Action':
            return (
              <TableCell key={col} className={alignClass}>
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
