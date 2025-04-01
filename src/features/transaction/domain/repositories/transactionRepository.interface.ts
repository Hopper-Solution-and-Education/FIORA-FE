import type { Prisma, Transaction } from '@prisma/client'; // Sử dụng Transaction từ Prisma Client

export interface ITransactionRepository {
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  getTransactionById(id: string, userId: string): Promise<Transaction | null>;
  updateTransaction(
    id: string,
    userId: string,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Transaction>;
  deleteTransaction(id: string, userId: string): Promise<void>;
  aggregate(options: Prisma.TransactionAggregateArgs): Promise<any>;
  createTransaction(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>;
  findManyTransactions(
    where: Prisma.TransactionWhereInput,
    options?: Prisma.TransactionFindManyArgs,
  ): Promise<Transaction[]>;
  count(where: Prisma.TransactionWhereInput): Promise<number>;
  getFilterOptions(userId: string): Promise<any>;
  // *CATEGORY ZONE
  updateTransactionsCategory(oldCategoryId: string, newCategoryId: string): Promise<void>;
}
