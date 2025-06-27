import { prisma } from '@/config';
import { IWalletRepository } from '../../repositories/walletRepository.interface';
import {
  Prisma,
  Wallet,
  WalletType,
  PackageFX,
  DepositRequest,
  DepositRequestStatus,
} from '@prisma/client';

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

  async findAllWalletsByUser(userId: string): Promise<Wallet[]> {
    return this._prisma.wallet.findMany({ where: { userId } });
  }

  async findAllPackageFX(): Promise<PackageFX[]> {
    return this._prisma.packageFX.findMany();
  }

  async getPackageFXById(id: string): Promise<PackageFX | null> {
    return this._prisma.packageFX.findUnique({ where: { id } });
  }

  async createDepositRequest(
    data: Prisma.DepositRequestUncheckedCreateInput,
  ): Promise<DepositRequest> {
    return this._prisma.depositRequest.create({ data });
  }

  async findDepositRequestsByType(
    userId: string,
    type: DepositRequestStatus,
  ): Promise<DepositRequest[]> {
    return this._prisma.depositRequest.findMany({ where: { userId, status: type } });
  }

  async findAllDepositRequestsByStatus(status: DepositRequestStatus): Promise<DepositRequest[]> {
    return this._prisma.depositRequest.findMany({ where: { status } });
  }

  async findManyPackageFXByIds(ids: string[]): Promise<PackageFX[]> {
    return this._prisma.packageFX.findMany({ where: { id: { in: ids } } });
  }
}

export const walletRepository = new WalletRepository();
