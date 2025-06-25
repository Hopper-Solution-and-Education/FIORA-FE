import { Prisma, Wallet, WalletType } from '@prisma/client';

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
}
