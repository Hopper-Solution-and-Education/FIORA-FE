import { Prisma, Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../domain/repositories/transactionRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class TransactionRepository implements ITransactionRepository {
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Sắp xếp theo thời gian tạo, mới nhất trước
    });
  }

  async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    return prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  async updateTransaction(
    id: string,
    userId: string,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id, userId }, // Đảm bảo chỉ cập nhật giao dịch của user
      data,
    });
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await prisma.transaction.delete({
      where: { id, userId }, // Đảm bảo chỉ xóa giao dịch của user
    });
  }
}

export const transactionRepository = new TransactionRepository();
