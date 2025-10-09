import { WalletWithdrawOverview } from '../../types';

export interface IWalletWithdrawRepository {
  getWalletWithdraw(userId: string): Promise<{
    data: WalletWithdrawOverview;
  }>;
  createWithdraw(userId: string, amount: number, otp: string): Promise<{ data: any }>;
  sendOtpWithDraw(userId: string): Promise<{ data: any }>;
}
