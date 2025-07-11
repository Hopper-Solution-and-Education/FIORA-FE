import { DepositRequestStatus } from '@/features/setting/module/wallet/domain';

export const WALLET_SETTING_CONSTANTS = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const;

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

export const WALLET_SETTING_TABLE_COLUMNS = {
  REQUEST_CODE: 'Request Code',
  REQUESTER: 'Requester',
  AMOUNT: 'Amount',
  REQUEST_DATE: 'Request Date',
  ATTACHMENT: 'Attachment',
  STATUS: 'Status',
  ACTION: 'Action',
} as const;

export const WALLET_SETTING_FILTER_OPTIONS = [
  { value: DepositRequestStatus.Requested, label: 'Requested' },
  { value: DepositRequestStatus.Approved, label: 'Approved' },
  { value: DepositRequestStatus.Rejected, label: 'Rejected' },
] as const;
