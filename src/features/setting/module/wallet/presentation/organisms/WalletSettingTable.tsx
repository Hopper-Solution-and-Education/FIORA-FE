import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationV2 } from '@/components/ui/pagination-v2';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletSettingTableData, WalletSettingPaginationProps } from '../types';
import { WalletSettingTableRow } from '../molecules';
import { WALLET_SETTING_TABLE_COLUMNS } from '@/features/setting/constants';

interface WalletSettingTableProps {
  data: WalletSettingTableData[];
  loading: boolean;
  pagination: WalletSettingPaginationProps;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  className?: string;
}

const WalletSettingTable: React.FC<WalletSettingTableProps> = ({
  data,
  loading,
  pagination,
  onPageChange,
  onView,
  onApprove,
  onReject,
  className,
}) => {
  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.REQUEST_CODE}</TableHead>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.REQUESTER}</TableHead>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.AMOUNT}</TableHead>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.REQUEST_DATE}</TableHead>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.ATTACHMENT}</TableHead>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.STATUS}</TableHead>
              <TableHead>{WALLET_SETTING_TABLE_COLUMNS.ACTION}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <WalletSettingTableRow
                  key={item.id}
                  data={item}
                  onView={onView}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && data.length > 0 && (
        <div className="flex justify-end">
          <PaginationV2
            currentPage={pagination.current}
            totalPages={pagination.total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default WalletSettingTable;
