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

  async update(id: string, account: Prisma.AccountUpdateInput): Promise<Account> {
    return prisma.account.update({ where: { id }, data: account });
  }

  async delete(options: Prisma.AccountDeleteArgs): Promise<Account> {
    return await prisma.account.delete(options);
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

    return prisma.account.findMany({
      where,
      // skip: paginate.skip,
      // take: paginate.take,
      // ...(select ? { select } : {}),
      // ...(include ? { include } : {}),
    });
  }

  async findByCondition(where: Prisma.AccountWhereInput): Promise<Account | null> {
    return prisma.account.findFirst({ where });
  }

  async findAllAccountByUserId(userId: string): Promise<any> {
    console.log('userId', userId);
    return prisma.account.groupBy({
      by: ['type'],
      where: {
        AND: {
          userId: '99b4ca81-5348-4058-a66a-245f720115fa',
          parentId: null,
        },
      },
      _sum: {
        balance: true,
      },
    });
  }

  async findManyWithConditions(
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

  async findManyWithCondition(
    where: Prisma.AccountWhereInput,
    options?: Prisma.AccountFindManyArgs,
  ): Promise<Account[] | []> {
    return prisma.account.findMany({
      where,
      ...options,
    });
  }

  async aggregate(options: Prisma.AccountAggregateArgs): Promise<any> {
    return prisma.account.aggregate(options);
  }

  async deductBalance(tx: Prisma.TransactionClient, accountId: string, amount: number) {
    await tx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
  }

  async receiveBalance(tx: Prisma.TransactionClient, accountId: string, amount: number) {
    await tx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async transferBalance(
    tx: Prisma.TransactionClient,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ) {
    // Trừ tiền từ tài khoản gửi
    await tx.account.update({
      where: { id: fromAccountId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Cộng tiền vào tài khoản nhận
    await tx.account.update({
      where: { id: toAccountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }
}

export const accountRepository = new AccountRepository();
