import { prisma } from '@/config';
import { Prisma, Transaction, TransactionType, Partner } from '@prisma/client';
import {
  ITransactionRepository,
  TransactionWithProducts,
} from '../../domain/repositories/transactionRepository.interface';

// Interface for enhanced partner with type information
interface EnhancedPartner extends Partner {
  type?: string;
}

// Interface for enhanced transaction with user info and enhanced partner
interface EnhancedTransaction extends Transaction {
  partner: EnhancedPartner | null;
  createdBy: any | null;
  updatedBy: any | null;
}

class TransactionRepository implements ITransactionRepository {
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await prisma.transaction.findMany({
      where: { userId },
      include: { partner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFirstTransaction(
    where: Prisma.TransactionWhereInput,
    options?: Prisma.TransactionFindFirstArgs,
  ): Promise<Transaction | null> {
    return await prisma.transaction.findFirst({
      where,
      ...options,
    });
  }

  async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: id,
        userId: userId,
        isDeleted: false,
      },
      include: {
        partner: true,
        fromAccount: true,
        toAccount: true,
        fromCategory: true,
        toCategory: true,
      },
    });

    if (!transaction) return null;

    // Fetch creator and updater user information separately
    const [createdBy, updatedBy] = await Promise.all([
      transaction.createdBy
        ? prisma.user.findUnique({
            where: { id: transaction.createdBy },
            select: { id: true, name: true, email: true, image: true },
          })
        : null,
      transaction.updatedBy
        ? prisma.user.findUnique({
            where: { id: transaction.updatedBy },
            select: { id: true, name: true, email: true, image: true },
          })
        : null,
    ]);

    // Create enhanced transaction object
    const enhancedTransaction: EnhancedTransaction = {
      ...transaction,
      createdBy,
      updatedBy,
      partner: transaction.partner ? { ...transaction.partner } : null,
    };

    // Determine partner type if partner exists
    if (enhancedTransaction.partner && transaction.partnerId) {
      // Get all transactions for this partner
      const partnerTransactions = await prisma.transaction.findMany({
        where: {
          partnerId: transaction.partnerId,
          userId: userId,
          isDeleted: false,
        },
        select: {
          type: true,
        },
      });

      // Check transaction types
      const hasIncomeType = partnerTransactions.some((t) => t.type === TransactionType.Income);
      const hasExpenseType = partnerTransactions.some((t) => t.type === TransactionType.Expense);

      // Determine partner type
      if (hasIncomeType && !hasExpenseType) {
        enhancedTransaction.partner.type = 'Supplier';
      } else if (!hasIncomeType && hasExpenseType) {
        enhancedTransaction.partner.type = 'Customer';
      } else if (hasIncomeType && hasExpenseType) {
        enhancedTransaction.partner.type = 'Customer & Supplier';
      } else {
        enhancedTransaction.partner.type = 'Unknown';
      }
    }

    // Return enhanced transaction
    return enhancedTransaction as any;
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
    return await prisma.transaction.count({
      where: {
        ...where,
      },
    });
  }

  async getFilterOptions(userId: string) {
    const [fromAccounts, toAccounts, fromCategories, toCategories, partners] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId, fromAccountId: { not: null } },
        select: {
          fromAccount: {
            select: { name: true },
          },
        },
        distinct: ['fromAccountId'],
      }),
      prisma.transaction.findMany({
        where: { userId, toAccountId: { not: null } },
        select: {
          toAccount: {
            select: { name: true },
          },
        },
        distinct: ['toAccountId'],
      }),
      prisma.transaction.findMany({
        where: { userId, fromCategoryId: { not: null } },
        select: {
          fromCategory: {
            select: { name: true },
          },
        },
        distinct: ['fromCategoryId'],
      }),
      prisma.transaction.findMany({
        where: { userId, toCategoryId: { not: null } },
        select: {
          toCategory: {
            select: { name: true },
          },
        },
        distinct: ['toCategoryId'],
      }),
      prisma.transaction.findMany({
        where: { userId, partnerId: { not: null } },
        select: {
          partner: {
            select: { name: true },
          },
        },
        distinct: ['partnerId'],
      }),
    ]);

    const accountsSet = new Set([
      ...fromAccounts.map((t) => t.fromAccount?.name),
      ...toAccounts.map((t) => t.toAccount?.name),
    ]);

    const categoriesSet = new Set([
      ...fromCategories.map((t) => t.fromCategory?.name),
      ...toCategories.map((t) => t.toCategory?.name),
    ]);

    return {
      accounts: Array.from(accountsSet),
      categories: Array.from(categoriesSet),
      partners: partners.map((t) => t.partner?.name),
    };
  }

  async getValidCategoryAccount(userId: string, type: TransactionType) {
    let fromAccounts: any[] = [];
    let toAccounts: any[] = [];
    let fromCategories: any[] = [];
    let toCategories: any[] = [];

    if (type === TransactionType.Expense) {
      [fromAccounts, toCategories] = await Promise.all([
        prisma.account.findMany({
          where: {
            userId,
            OR: [{ type: 'Payment' }, { type: 'CreditCard' }],
          },
          select: {
            id: true,
            name: true,
            type: true,
          },
        }),
        prisma.category.findMany({
          where: { userId, type: 'Expense' },
          select: {
            id: true,
            name: true,
          },
        }),
      ]);
    }

    if (type === TransactionType.Income) {
      [fromCategories, toAccounts] = await Promise.all([
        prisma.category.findMany({
          where: { userId, type: 'Income' },
          select: {
            id: true,
            name: true,
          },
        }),
        prisma.account.findMany({
          where: {
            userId,
            OR: [{ type: 'Payment' }, { type: 'CreditCard' }, { type: 'Debt' }],
          },

          select: {
            id: true,
            name: true,
            type: true,
          },
        }),
      ]);
    }

    if (type === TransactionType.Transfer) {
      [fromAccounts, toAccounts] = await Promise.all([
        prisma.account.findMany({
          where: {
            userId,
            OR: [
              { type: 'Payment' },
              { type: 'CreditCard' },
              { type: 'Saving' },
              { type: 'Lending' },
            ],
          },
          select: {
            id: true,
            name: true,
            type: true,
          },
        }),
        prisma.account.findMany({
          where: { userId },
          select: {
            id: true,
            name: true,
            type: true,
          },
        }),
      ]);
    }

    return {
      fromAccounts: fromAccounts,
      toAccounts: toAccounts,
      fromCategories: fromCategories,
      toCategories: toCategories,
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

  // *PRODUCT ZONE
  async findProductTransactions(userId: string): Promise<TransactionWithProducts[]> {
    return (await prisma.transaction.findMany({
      where: {
        userId,
        isDeleted: false,
        productsRelation: {
          some: {},
        },
      },
      include: {
        productsRelation: {
          include: {
            product: true,
          },
        },
        partner: true,
        fromAccount: true,
        toAccount: true,
        fromCategory: true,
        toCategory: true,
      },
      orderBy: { createdAt: 'desc' },
    })) as unknown as TransactionWithProducts[];
  }
}

export const transactionRepository = new TransactionRepository();
