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

  async isDepositRefCodeExists(refCode: string): Promise<boolean> {
    const count = await this._prisma.depositRequest.count({ where: { refCode } });
    return count > 0;
  }

  async getDepositRequestsPaginated(
    page: number,
    pageSize: number,
  ): Promise<{
    items: DepositRequest[];
    total: number;
  }> {
    const [items, total] = await Promise.all([
      this._prisma.depositRequest.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          package: {
            select: {
              id: true,
              fxAmount: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          attachment: true,
        },
      }),

      this._prisma.depositRequest.count(),
    ]);
    return { items, total };
  }

  async updateDepositRequestStatus(
    id: string,
    newStatus: DepositRequestStatus,
  ): Promise<DepositRequest | null> {
    // Only allow update if current status is 'Requested' and newStatus is 'Approved' or 'Rejected'
    const current = await this._prisma.depositRequest.findUnique({ where: { id } });
    if (!current) return null;
    if (
      current.status !== DepositRequestStatus.Requested ||
      (newStatus !== DepositRequestStatus.Approved && newStatus !== DepositRequestStatus.Rejected)
    ) {
      return null;
    }
    return this._prisma.depositRequest.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}

export const walletRepository = new WalletRepository();
