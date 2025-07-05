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
};

export type WalletSettingTableColumnKey =
  | 'Request Code'
  | 'Requester'
  | 'Amount'
  | 'Request Date'
  | 'Attachment'
  | 'Status'
  | 'Action';

export type WalletSettingTableColumnKeyType = {
  [key in WalletSettingTableColumnKey]: WalletSettingTableColumn;
};

export const WALLET_SETTING_TABLE_COLUMN_CONFIG: WalletSettingTableColumnKeyType = {
  'Request Code': { index: 0, sortable: true, isVisible: true },
  Requester: { index: 1, sortable: true, isVisible: true },
  Amount: { index: 2, sortable: true, isVisible: true },
  'Request Date': { index: 3, sortable: true, isVisible: true },
  Attachment: { index: 4, sortable: false, isVisible: true },
  Status: { index: 5, sortable: true, isVisible: true },
  Action: { index: 6, sortable: false, isVisible: true },
};
