import { Prisma, Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../domain/repositories/transactionRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class TransactionRepository implements ITransactionRepository {
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await prisma.transaction.findMany({
      where: { userId },
      include: { partner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    return await prisma.transaction.findFirst({
      where: { id: id, userId: userId },
    });
  }

  async updateTransaction(
    id: string,
    userId: string,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Transaction> {
    return await prisma.transaction.update({
      where: { id: id, userId: userId },
      data,
    });
  }

  async aggregate(options: Prisma.TransactionAggregateArgs): Promise<any> {
    return prisma.transaction.aggregate(options);
  }

  async createTransaction(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return await prisma.transaction.create({
      data,
    });
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await prisma.transaction.update({
      where: { id: id, userId: userId },
      data: { isDeleted: true },
    });
  }

  async findManyTransactions(
    where: Prisma.TransactionWhereInput,
    options?: Prisma.TransactionFindManyArgs,
  ): Promise<Transaction[]> {
    return await prisma.transaction.findMany({ where, ...options });
  }

  async count(where: Prisma.TransactionWhereInput): Promise<number> {
    return await prisma.transaction.count({ where });
  }

  async getFilterOptions(userId: string) {
    const [fromAccounts, toAccounts, fromCategories, toCategories, partners] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId, fromAccountId: { not: null } },
        select: {
          fromAccount: {
            select: {
              name: true,
            },
          },
        },
        distinct: ['fromAccountId'],
      }),
      prisma.transaction.findMany({
        where: { userId, toAccountId: { not: null } },
        select: {
          toAccount: {
            select: {
              name: true,
            },
          },
        },
        distinct: ['toAccountId'],
      }),
      prisma.transaction.findMany({
        where: { userId, fromCategoryId: { not: null } },
        select: {
          fromCategory: {
            select: {
              name: true,
            },
          },
        },
        distinct: ['fromCategoryId'],
      }),
      prisma.transaction.findMany({
        where: { userId, toCategoryId: { not: null } },
        select: {
          toCategory: {
            select: {
              name: true,
            },
          },
        },
        distinct: ['toCategoryId'],
      }),
      prisma.transaction.findMany({
        where: { userId, partnerId: { not: null } },
        select: {
          partner: {
            select: {
              name: true,
            },
          },
        },
        distinct: ['partnerId'],
      }),
    ]);

    return {
      fromAccounts: fromAccounts.map((t) => t.fromAccount?.name),
      toAccounts: toAccounts.map((t) => t.toAccount?.name),
      fromCategories: fromCategories.map((t) => t.fromCategory?.name),
      toCategories: toCategories.map((t) => t.toCategory?.name),
      partners: partners.map((t) => t.partner?.name),
    };
  }

  // *CATEGORY ZONE
  async updateTransactionsCategory(oldCategoryId: string, newCategoryId: string): Promise<void> {
    await prisma.transaction.updateMany({
      where: { fromCategoryId: oldCategoryId },
      data: { fromCategoryId: newCategoryId },
    });
    await prisma.transaction.updateMany({
      where: { toCategoryId: oldCategoryId },
      data: { toCategoryId: newCategoryId },
    });
  }

  // *PARTNER ZONE
  async updateTransactionsPartner(oldPartnerId: string, newPartnerId: string): Promise<void> {
    await prisma.transaction.updateMany({
      where: { partnerId: oldPartnerId },
      data: { partnerId: newPartnerId },
    });
  }
}

export const transactionRepository = new TransactionRepository();
