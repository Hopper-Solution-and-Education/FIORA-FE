import { DepositRequestStatus, FXRequestType } from '@/features/setting/module/wallet/domain';

// Pagination and UI behavior constants for wallet settings
export const WALLET_SETTING_CONSTANTS = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const;

// Status options with color schemes for deposit request badges
export const WALLET_SETTING_STATUS_OPTIONS = [
  {
    value: DepositRequestStatus.Requested,
    label: 'Requested',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: DepositRequestStatus.Approved,
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: DepositRequestStatus.Rejected,
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
  },
] as const;

// Filter options for status-based filtering
export const WALLET_SETTING_FILTER_OPTIONS = [
  { value: DepositRequestStatus.Requested, label: 'Requested' },
  { value: DepositRequestStatus.Approved, label: 'Approved' },
  { value: DepositRequestStatus.Rejected, label: 'Rejected' },
] as const;

// Filter options for type-based filtering
export const WALLET_SETTING_TYPE_FILTER_OPTIONS = [
  { value: FXRequestType.Deposit, label: 'Deposit' },
  { value: FXRequestType.Withdraw, label: 'Withdraw' },
] as const;

export const DEFAULT_MIN_AMOUNT = 0;
export const DEFAULT_MAX_AMOUNT = 1000;
