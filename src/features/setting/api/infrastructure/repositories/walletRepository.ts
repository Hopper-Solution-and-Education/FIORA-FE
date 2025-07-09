import { prisma } from '@/config';
import { FilterObject } from '@/shared/types/filter.types';
import { FilterBuilder } from '@/shared/utils/filterBuilder';
import {
  DepositRequest,
  DepositRequestStatus,
  PackageFX,
  Prisma,
  Wallet,
  WalletType,
} from '@prisma/client';
import { IWalletRepository } from '../../repositories/walletRepository.interface';

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
    filter?: FilterObject,
  ): Promise<{
    items: DepositRequest[];
    total: number;
  }> {
    // Convert FilterObject to Prisma where clause
    let where: any = {};
    if (filter) {
      // Custom logic for search, status, amount range
      // Parse filter to DynamicFilterGroup for easier handling
      const group = FilterBuilder.parseDynamicFilter(filter);

      console.log(group);

      for (const ruleOrGroup of group.rules) {
        if ('condition' in ruleOrGroup) continue; // skip nested for now

        const rule = ruleOrGroup;
        switch (rule.field) {
          case 'search':
            // search applies to refCode, user.email, user.name
            where.OR = [
              { refCode: { contains: rule.value, mode: 'insensitive' } },
              { user: { email: { contains: rule.value, mode: 'insensitive' } } },
              { user: { name: { contains: rule.value, mode: 'insensitive' } } },
            ];
            break;
          case 'status':
            if (rule.operator === 'in') {
              where.status = { in: rule.value };
            } else {
              where.status = rule.value;
            }
            break;
          case 'amount':
            // amount is from package.fxAmount
            if (rule.operator === 'between') {
              const arr = Array.isArray(rule.value) ? (rule.value as [number, number]) : [0, 0];
              where.package = { fxAmount: { gte: arr[0], lte: arr[1] } };
            } else if (rule.operator === 'gte') {
              where.package = { fxAmount: { gte: rule.value as number } };
            } else if (rule.operator === 'lte') {
              where.package = { fxAmount: { lte: rule.value as number } };
            }
            break;
          default:
            // fallback: direct field
            where[rule.field] = rule.value;
        }
      }
    }

    const [items, total] = await Promise.all([
      this._prisma.depositRequest.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        where,
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
      this._prisma.depositRequest.count({ where }),
    ]);
    return { items, total };
  }

  async updateDepositRequestStatus(
    id: string,
    newStatus: DepositRequestStatus,
    remark?: string,
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

    // Nếu là Rejected thì lưu remark
    const updateData: any = { status: newStatus };
    if (newStatus === DepositRequestStatus.Rejected && remark) {
      updateData.remark = remark;
    }

    return this._prisma.depositRequest.update({
      where: { id },
      data: updateData,
    });
  }

  async findDepositRequestById(id: string): Promise<DepositRequest | null> {
    return this._prisma.depositRequest.findUnique({ where: { id } });
  }

  async increaseWalletBalance(walletId: string, amount: number): Promise<void> {
    await this._prisma.wallet.update({
      where: { id: walletId },
      data: { frBalanceActive: { increment: amount } },
    });
  }
}

export const walletRepository = new WalletRepository();
