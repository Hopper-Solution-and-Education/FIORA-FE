import {
  DepositRequest,
  DepositRequestStatus,
  PackageFX,
  Prisma,
  Wallet,
  WalletType,
} from '@prisma/client';

export interface IWalletRepository {
  createWallet(data: Prisma.WalletUncheckedCreateInput): Promise<Wallet>;
  findWalletById(where: Prisma.WalletWhereInput): Promise<Wallet | null>;
  findManyWallets(where: Prisma.WalletWhereInput): Promise<Wallet[]>;
  updateWallet(
    where: Prisma.WalletWhereUniqueInput,
    data: Prisma.WalletUpdateInput,
  ): Promise<Wallet>;
  deleteWallet(where: Prisma.WalletWhereUniqueInput): Promise<Wallet>;
  findWalletByType(type: WalletType, userId: string): Promise<Wallet | null>;
  findAllWalletsByUser(userId: string): Promise<Wallet[]>;
  findAllPackageFX(): Promise<PackageFX[]>;
  getPackageFXById(id: string): Promise<PackageFX | null>;
  createDepositRequest(data: Prisma.DepositRequestUncheckedCreateInput): Promise<DepositRequest>;
  findDepositRequestsByType(userId: string, type: DepositRequestStatus): Promise<DepositRequest[]>;
  findAllDepositRequestsByStatus(status: DepositRequestStatus): Promise<DepositRequest[]>;
  findManyPackageFXByIds(ids: string[]): Promise<PackageFX[]>;
  isDepositRefCodeExists(refCode: string): Promise<boolean>;
  getDepositRequestsPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ items: DepositRequest[]; total: number }>;
  updateDepositRequestStatus(
    id: string,
    newStatus: DepositRequestStatus,
    remark?: string,
  ): Promise<DepositRequest | null>;
  findDepositRequestById(id: string): Promise<DepositRequest | null>;
  increaseWalletBalance(walletId: string, amount: number): Promise<void>;
}
