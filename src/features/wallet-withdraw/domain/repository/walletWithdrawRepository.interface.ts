export interface IWalletWithdrawRepository {
  getWalletWithdraw(userId: string): Promise<{
    data: any;
  }>;
  createWithdraw(userId: string, amount: number, otp: string): Promise<{ data: any }>;
  sendOtpWithDraw(userId: string): Promise<{ data: any }>;
}
