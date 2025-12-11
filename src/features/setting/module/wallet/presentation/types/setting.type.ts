import { OrderType } from '@/shared/types';
import { DepositRequest } from '../../domain';

export interface WalletSettingTableData extends DepositRequest {
  key: string;
}

export interface DepositRequestsPaginated {
  items: DepositRequest[];
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
}

export type WalletSettingTableColumn = {
  index: number;
  sortable: boolean;
  sortedBy?: OrderType;
  isVisible: boolean;
  side: 'left' | 'right' | 'center';
};

export type WalletSettingTableColumnKey =
  | 'Request Code'
  | 'Type'
  | 'Requester'
  | 'Bank Name'
  | 'Bank Number'
  | 'Amount'
  | 'Request Date'
  | 'Attachment'
  | 'Status'
  | 'Reason'
  | 'Action';

export type WalletSettingTableColumnKeyType = {
  [key in WalletSettingTableColumnKey]: WalletSettingTableColumn;
};

export const WALLET_SETTING_TABLE_COLUMN_CONFIG: WalletSettingTableColumnKeyType = {
  'Request Code': { index: 0, sortable: true, isVisible: true, side: 'center' },
  Type: { index: 1, sortable: true, isVisible: true, side: 'center' },
  Requester: { index: 2, sortable: true, isVisible: true, side: 'left' },
  'Bank Name': { index: 3, sortable: true, isVisible: true, side: 'center' },
  'Bank Number': { index: 4, sortable: true, isVisible: true, side: 'center' },
  Amount: { index: 5, sortable: true, isVisible: true, side: 'center' },
  'Request Date': { index: 6, sortable: true, isVisible: true, side: 'center' },
  Attachment: { index: 7, sortable: false, isVisible: true, side: 'center' },
  Status: { index: 8, sortable: true, isVisible: true, side: 'center' },
  Reason: { index: 9, sortable: false, isVisible: true, side: 'left' },
  Action: { index: 10, sortable: false, isVisible: true, side: 'center' },
};
