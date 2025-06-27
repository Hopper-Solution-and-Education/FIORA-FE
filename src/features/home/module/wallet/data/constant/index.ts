import { WalletType } from '../../domain/enum';
import { FilterCriteria } from '@/shared/types/filter.types';

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

export * from './attachmentConstants';
