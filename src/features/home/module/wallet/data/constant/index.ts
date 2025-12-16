import { FilterCriteria } from '@/shared/types';
import { WalletType } from '../../domain/enum';

export const DEFAULT_MIN_BALANCE = 0;
export const DEFAULT_MAX_BALANCE = 1000000;
export const DEFAULT_SLIDER_STEP = 1000;

export const WALLET_TYPE_OPTIONS = Object.values(WalletType).map((type) => ({
  value: type,
  label: type,
}));

export const DEFAULT_WALLET_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

export const WALLET_TABLE_COLUMNS = {
  'No.': { index: 0, sortable: false },
  Name: { index: 1, sortable: true },
  Type: { index: 2, sortable: true },
  Balance: { index: 3, sortable: true },
  Frozen: { index: 4, sortable: true },
  'Credit Limit': { index: 5, sortable: true },
  Status: { index: 6, sortable: false },
  Actions: { index: 7, sortable: false },
};

export * from './attachmentConstants';
