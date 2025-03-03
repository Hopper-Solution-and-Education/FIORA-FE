// infrastructure/repositories/accountRepository.ts
import prisma from '@/infrastructure/database/prisma';
import { Account, Prisma } from '@prisma/client';
import {
  IAccountRepository,
  Pagination,
  SelectOptions,
} from '../../domain/repositories/accountRepository.interface';

export class AccountRepository implements IAccountRepository {
  async create(account: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    return prisma.account.create({ data: account });
  }

  async findById(id: string): Promise<Account | null> {
    return prisma.account.findUnique({ where: { id } });
  }

  async findAll(): Promise<Account[]> {
    return prisma.account.findMany();
  }

  async update(id: string, account: Partial<Account>): Promise<Account> {
    return prisma.account.update({ where: { id }, data: account });
  }

  async delete(id: string): Promise<void> {
    await prisma.account.delete({ where: { id } });
  }

  async updateParentBalance(parentId: string): Promise<void> {
    // Helper function to update parent balance (sum of sub-accounts)
    const subAccounts = await prisma.account.findMany({
      where: { parentId },
      select: { balance: true },
    });

    if (subAccounts.length === 0) {
      return;
    }

    const totalBalance = subAccounts.reduce(
      (acc, curr) => acc + (curr.balance ? curr.balance.toNumber() : 0),
      0,
    );
    await prisma.account.update({
      where: { id: parentId },
      data: { balance: totalBalance },
    });
  }

  async findMany(
    where: Prisma.AccountWhereInput,
    options: SelectOptions,
    pagination?: Pagination,
  ): Promise<Account[]> {
    const paginate = {} as { skip?: number; take?: number };
    if (pagination) {
      const { page, size } = pagination;
      const skip = (page - 1) * size;
      const take = size;
      paginate.skip = skip;
      paginate.take = take;
    }

    const { include, select } = options;

    return prisma.account.findMany({
      where,
      skip: paginate.skip,
      take: paginate.take,
      ...(select ? { select } : {}),
      ...(include ? { include } : {}),
    });
  }
}

export const accountRepository = new AccountRepository();
