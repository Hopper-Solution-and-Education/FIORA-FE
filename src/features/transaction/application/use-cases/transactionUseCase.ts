import type { Prisma, Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../domain/repositories/transactionRepository.interface';
import { transactionRepository } from '../../infrastructure/repositories/transactionRepository';

class TransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async listTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.getTransactionsByUserId(userId);
  }

  async viewTransaction(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error('Transaction not found or you do not have permission');
    }
    return transaction;
  }

  async editTransaction(
    id: string,
    userId: string,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error('Transaction not found or you do not have permission');
    }
    return this.transactionRepository.updateTransaction(id, userId, data);
  }

  async removeTransaction(id: string, userId: string): Promise<void> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error('Transaction not found or you do not have permission');
    }
    await this.transactionRepository.deleteTransaction(id, userId);
  }
}

export const transactionUseCase = new TransactionUseCase(transactionRepository);
