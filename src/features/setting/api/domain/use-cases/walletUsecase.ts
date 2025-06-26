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

  async getAllWalletsByUser(userId: string) {
    return this._walletRepository.findAllWalletsByUser(userId);
  }

  async getAllPackageFX() {
    return this._walletRepository.findAllPackageFX();
  }

  async getDepositRequestsByType(
    userId: string,
    type: import('@prisma/client').DepositRequestStatus,
  ) {
    return this._walletRepository.findDepositRequestsByType(userId, type);
  }
}

export const walletUseCase = new WalletUseCase();
