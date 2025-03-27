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
}

export const transactionRepository = new TransactionRepository();
