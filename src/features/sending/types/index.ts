export type OtpState = 'Get' | 'Resend';

type WalletReceiverAccount = {
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
