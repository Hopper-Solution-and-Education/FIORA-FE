import {
  WALLET_SETTING_TABLE_COLUMN_CONFIG,
  WalletSettingTableColumnKeyType,
} from '../../presentation/types/setting.type';

export interface WalletSettingState {
  loading: boolean;
  error: string | null;
  columnConfig: WalletSettingTableColumnKeyType;
  updatingItems: string[];
}

export const initialState: WalletSettingState = {
  loading: false,
  error: null,
  columnConfig: WALLET_SETTING_TABLE_COLUMN_CONFIG,
  updatingItems: [],
};
