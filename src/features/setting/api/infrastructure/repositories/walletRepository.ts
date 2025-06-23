import { prisma } from '@/config';
import { IWalletRepository } from '../../repositories/walletRepository.interface';
import { Prisma, Wallet, WalletType } from '@prisma/client';

class WalletRepository implements IWalletRepository {
  constructor(private _prisma = prisma) {}

  async createWallet(data: Prisma.WalletUncheckedCreateInput): Promise<Wallet> {
    return this._prisma.wallet.create({ data });
  }

  async findWalletById(where: Prisma.WalletWhereInput): Promise<Wallet | null> {
    return this._prisma.wallet.findFirst({ where });
  }

  async findManyWallets(where: Prisma.WalletWhereInput): Promise<Wallet[]> {
    return this._prisma.wallet.findMany({ where });
  }

  async updateWallet(
    where: Prisma.WalletWhereUniqueInput,
    data: Prisma.WalletUpdateInput,
  ): Promise<Wallet> {
    return this._prisma.wallet.update({ where, data });
  }

  async deleteWallet(where: Prisma.WalletWhereUniqueInput): Promise<Wallet> {
    return this._prisma.wallet.delete({ where });
  }

  async findWalletByType(type: WalletType, userId: string): Promise<Wallet | null> {
    return this._prisma.wallet.findFirst({
      where: {
        type,
        userId,
      },
    });
  }
}

export const walletRepository = new WalletRepository();
