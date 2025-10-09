export type OtpState = 'Get' | 'Resend';

type WalletWithdrawBankAccount = {
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
