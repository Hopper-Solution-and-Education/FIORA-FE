import { OrderType } from '@/shared/types';

export type TransactionTableColumn = {
  index: number;
  sortable: boolean;
  sortedBy?: OrderType;
};

export type WalletSettingColumn =
  | 'Request Code'
  | 'Requester'
  | 'Amount'
  | 'Request Date'
  | 'Attachment'
  | 'Status'
  | 'Action';

export type WalletSettingTableColumnKey = {
  [key in WalletSettingColumn]: WalletSettingColumn;
};
