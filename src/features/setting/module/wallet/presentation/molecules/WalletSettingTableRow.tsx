import { TableCell, TableRow } from '@/components/ui/table';
import { useCurrencyFormatter } from '@/shared/hooks';
import { formatDateTime } from '@/shared/lib/formatDateTime';
import { FXRequestType } from '../../domain';
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
  const { formatCurrency } = useCurrencyFormatter();
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
          case 'Type':
            return (
              <TableCell key={col} className={alignClass}>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.type === FXRequestType.Deposit
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}
                >
                  {data.type}
                </span>
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
                {formatCurrency(data.fxAmount, 'FX')}
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
          case 'Reason':
            return (
              <TableCell key={col} className={`max-w-[200px] ${alignClass}`}>
                <div className="truncate" title={data.remark || ''}>
                  {data.remark || '-'}
                </div>
              </TableCell>
            );
          case 'Action':
            return (
              <TableCell key={col} className={alignClass}>
                <WalletSettingActionButton status={data.status} type={data.type} id={data.id} />
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
