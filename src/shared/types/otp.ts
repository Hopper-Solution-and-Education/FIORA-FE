export type OtpState = 'Get' | 'Resend' | 'Verify';

export type WalletReceiverAccount = {
  accountNumber: string | null;
  accountName: string | null;
};

export type WalletSendingOverview = {
  daily_moving_limit: number;
  onetime_moving_limit: number;
  available_limit: number;
  moved_amount: number;
  reiceiver: WalletReceiverAccount;
};

export type WalletWithdrawBankAccount = {
  accountNumber: string | null;
  accountName: string | null;
};

export type WalletWithdrawOverview = {
  daily_moving_limit: number;
  onetime_moving_limit: number;
  available_limit: number;
  moved_amount: number;
  bankAccount: WalletWithdrawBankAccount;
};

export interface OptionDropdown {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}
