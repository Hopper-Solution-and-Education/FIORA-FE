import { FilterOperator } from '@/shared/types';
import { WalletSettingFilterGroup } from '../../data/types/walletSettingFilter.types';
import { DepositRequestStatus } from '../../domain';
import {
  WALLET_SETTING_TABLE_COLUMN_CONFIG,
  WalletSettingTableColumnKeyType,
} from '../../presentation/types/setting.type';

export interface WalletSettingState {
  loading: boolean;
  error: string | null;
  columnConfig: WalletSettingTableColumnKeyType;
  updatingItems: string[];
  showRejectModal: boolean;
  rejectingId: string | null;
  filter: WalletSettingFilterGroup;
  search: string; // Add search field
}

export const initialState: WalletSettingState = {
  loading: false,
  error: null,
  columnConfig: WALLET_SETTING_TABLE_COLUMN_CONFIG,
  updatingItems: [],
  showRejectModal: false,
  rejectingId: null,
  filter: {
    condition: 'AND',
    rules: [
      {
        field: 'search',
        operator: FilterOperator.CONTAINS,
        value: '',
      },
      {
        field: 'status',
        operator: FilterOperator.IN,
        value: [
          DepositRequestStatus.Requested,
          DepositRequestStatus.Approved,
          DepositRequestStatus.Rejected,
        ],
      },
      {
        field: 'amount',
        operator: FilterOperator.BETWEEN,
        value: [0, 1000000], // Use BETWEEN for amount range with min=0, max=1000000
      },
    ],
  },
  search: '', // Add default value for search
};
