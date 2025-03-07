import { Prisma, Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../domain/repositories/transactionRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class TransactionRepository implements ITransactionRepository {
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Sắp xếp theo thời gian tạo, mới nhất trước
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
    await prisma.transaction.delete({
      where: { id: id, userId: userId }, // Đảm bảo chỉ xóa giao dịch của user
    });
  }
}

export const transactionRepository = new TransactionRepository();
