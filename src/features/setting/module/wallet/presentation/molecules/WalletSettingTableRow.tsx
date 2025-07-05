import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { WalletSettingTableData } from '../types';
import { WalletSettingStatusBadge } from '../atoms';
import { WalletSettingActionButton } from '../atoms';
import { WalletSettingAttachmentLink } from '../atoms';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { formatDateTime } from '@/shared/lib/formatDateTime';

interface WalletSettingTableRowProps {
  data: WalletSettingTableData;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const WalletSettingTableRow: React.FC<WalletSettingTableRowProps> = ({
  data,
  onView,
  onApprove,
  onReject,
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{data.refCode}</TableCell>
      <TableCell>{data.userId}</TableCell>
      <TableCell>{formatCurrency(data.fxAmount, 'USD')}</TableCell>
      <TableCell>{formatDateTime(data.createdAt)}</TableCell>
      <TableCell>
        <WalletSettingAttachmentLink attachment={data.attachment} />
      </TableCell>
      <TableCell>
        <WalletSettingStatusBadge status={data.status} />
      </TableCell>
      <TableCell>
        <WalletSettingActionButton
          status={data.status}
          onView={() => onView(data.id)}
          onApprove={() => onApprove(data.id)}
          onReject={() => onReject(data.id)}
        />
      </TableCell>
    </TableRow>
  );
};

export default WalletSettingTableRow;
