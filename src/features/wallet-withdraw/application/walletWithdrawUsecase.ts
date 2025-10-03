import { IWalletWithdrawRepository } from '../domain/repository/walletWithdrawRepository.interface';
import { walletWithdrawRepo } from '../infrastructure/walletWithdrawRepository';

class walletWithdrwawUsecase {
  constructor(private walletWithdrawRepository: IWalletWithdrawRepository = walletWithdrawRepo) {}
  async getWalletWithdraw(userId: string) {
    return await this.walletWithdrawRepository.getWalletWithdraw(userId);
  }
  async createWithdraw(userId: string, amount: number, otp: string) {
    return await this.walletWithdrawRepository.createWithdraw(userId, amount, otp);
  }
  async sendOtpWithDraw(userId: string) {
    return await this.walletWithdrawRepository.sendOtpWithDraw(userId);
  }
}
export const walletWithdrawUsecase = new walletWithdrwawUsecase();
