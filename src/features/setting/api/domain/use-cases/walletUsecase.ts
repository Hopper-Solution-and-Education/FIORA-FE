import { Prisma, WalletType } from '@prisma/client';
import { walletRepository } from '../../infrastructure/repositories/walletRepository';
import { IWalletRepository } from '../../repositories/walletRepository.interface';

class WalletUseCase {
  constructor(private _walletRepository: IWalletRepository = walletRepository) {}

  async createWallet(data: Prisma.WalletUncheckedCreateInput) {
    return this._walletRepository.createWallet(data);
  }

  async getWalletByType(type: WalletType, userId: string) {
    return this._walletRepository.findWalletByType(type, userId);
  }
}

export const walletUseCase = new WalletUseCase();
