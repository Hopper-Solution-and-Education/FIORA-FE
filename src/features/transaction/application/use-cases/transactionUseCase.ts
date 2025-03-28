import { BooleanUtils } from '@/config/booleanUtils';
import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { ICategoryRepository } from '@/features/setting/domain/repositories/categoryRepository.interface';
import { categoryRepository } from '@/features/setting/infrastructure/repositories/categoryRepository';
import prisma from '@/infrastructure/database/prisma';
import { Messages } from '@/shared/constants/message';
import {
  AccountType,
  CategoryType,
  TransactionType,
  type Account,
  type Prisma,
  type Transaction,
} from '@prisma/client';
import { ITransactionRepository } from '../../domain/repositories/transactionRepository.interface';
import { transactionRepository } from '../../infrastructure/repositories/transactionRepository';
import { TransactionGetPagination } from '@/shared/types/transaction.types';
import { PaginationResponse } from '@/shared/types/Common.types';
import { buildOrderByTransaction, buildWhereClause } from '@/shared/utils';

class TransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async listTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.getTransactionsByUserId(userId);
  }

  async getTransactions(
    params: TransactionGetPagination,
  ): Promise<PaginationResponse<Transaction>> {
    const { page = 1, pageSize = 20, filters, sortBy = {}, userId } = params;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    const where = buildWhereClause(filters);
    const orderBy = buildOrderByTransaction(sortBy);

    const transactionAwaited = this.transactionRepository.findManyTransactions(
      {
        ...where,
        userId,
      },
      {
        skip,
        take,
        orderBy,
        include: {
          fromAccount: true,
          fromCategory: true,
          toAccount: true,
          toCategory: true,
          partner: true,
        },
      },
    );
    const totalTransactionAwaited = this.transactionRepository.count({});

    const [transactions, total] = await Promise.all([transactionAwaited, totalTransactionAwaited]);

    const totalPage = Math.ceil(total / pageSize);

    return {
      data: transactions,
      totalPage,
      page,
      pageSize,
    };
  }

  async viewTransaction(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error(Messages.INTERNAL_ERROR);
    }
    return transaction;
  }

  private async revertOldTransaction(tx: Prisma.TransactionClient, transaction: Transaction) {
    const fromAccount = transaction.fromAccountId
      ? await tx.account.findUnique({ where: { id: transaction.fromAccountId } })
      : null;
    const toAccount = transaction.toAccountId
      ? await tx.account.findUnique({ where: { id: transaction.toAccountId } })
      : null;

    if (!fromAccount && !toAccount) {
      throw new Error(Messages.ACCOUNT_NOT_FOUND);
    }

    const amount = transaction.amount.toNumber();

    switch (transaction.type) {
      case TransactionType.Expense:
        if (fromAccount) {
          await this.accountRepository.receiveBalance(tx, fromAccount.id, amount);
        }
        break;

      case TransactionType.Income:
        if (toAccount) {
          this.validateSufficientBalance(
            toAccount.balance!.toNumber(),
            amount,
            `Tài khoản ${toAccount.name} không đủ số dư để hoàn tác giao dịch thu nhập.`,
          );
          await this.accountRepository.deductBalance(tx, toAccount.id, amount);
        }
        break;

      case TransactionType.Transfer:
        if (fromAccount && toAccount) {
          this.validateSufficientBalance(
            toAccount.balance!.toNumber(),
            amount,
            `Tài khoản ${toAccount.name} không đủ số dư để hoàn trả giao dịch chuyển khoản.`,
          );
          await this.accountRepository.transferBalance(tx, toAccount.id, fromAccount.id, amount);
        }
        break;
    }

    await this.revertProductPrices(tx, transaction);
    await tx.productTransaction.deleteMany({ where: { transactionId: transaction.id } });
  }

  private validateSufficientBalance(balance: number, amount: number, errorMessage: string) {
    if (balance < amount) {
      throw new Error(errorMessage);
    }
  }

  private async revertProductPrices(tx: Prisma.TransactionClient, transaction: Transaction) {
    const productTransactions = await tx.productTransaction.findMany({
      where: { transactionId: transaction.id },
      select: { productId: true },
    });

    const productIds = productTransactions.map((pt) => pt.productId);
    if (productIds.length === 0) return;

    const splitAmount = transaction.amount.toNumber() / productIds.length;
    await tx.product.updateMany({
      where: { id: { in: productIds } },
      data: { price: { decrement: splitAmount } },
    });
  }

  async removeTransaction(id: string, userId: string): Promise<void> {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({ where: { id } });
      if (!transaction) {
        throw new Error(Messages.TRANSACTION_NOT_FOUND);
      }

      await this.revertOldTransaction(tx, transaction);

      return await this.transactionRepository.deleteTransaction(id, userId);
    });
  }

  async createTransaction(data: Prisma.TransactionUncheckedCreateInput) {
    const transactionHandlers: Record<
      TransactionType,
      (data: Prisma.TransactionUncheckedCreateInput) => Promise<any>
    > = {
      [TransactionType.Expense]: this.createTransaction_Expense.bind(this),
      [TransactionType.Income]: this.createTransaction_Income.bind(this),
      [TransactionType.Transfer]: this.createTransaction_Transfer.bind(this),
    };

    const handler = transactionHandlers[data.type as TransactionType];

    if (!handler) {
      throw new Error(Messages.INVALID_TRANSACTION_TYPE);
    }

    return handler(data);
  }

  async createTransaction_Expense(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: {
          id: data.fromAccountId as string,
        },
      });
      if (!account) {
        throw new Error(Messages.ACCOUNT_NOT_FOUND);
      }

      const type = account.type;
      if (type !== AccountType.Payment && type !== AccountType.CreditCard) {
        throw new Error(Messages.INVALID_ACCOUNT_TYPE_FOR_EXPENSE);
      }

      BooleanUtils.chooseByMap(
        type,
        {
          [AccountType.Payment]: () => this.validatePaymentAccount(account, data.amount as number),
          [AccountType.CreditCard]: () =>
            this.validateCreditCardAccount(account, data.amount as number),
        },
        () => {
          throw new Error(Messages.UNSUPPORTED_ACCOUNT_TYPE.replace('{type}', type));
        },
      );

      if (!data.toCategoryId) {
        throw new Error(Messages.CATEGORY_NOT_FOUND);
      }
      const category = await tx.category.findUnique({
        where: { id: data.toCategoryId as string },
      });
      if (!category || category.type !== CategoryType.Expense) {
        throw new Error(Messages.INVALID_CATEGORY_TYPE_EXPENSE);
      }

      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          date: data.date,
          type: data.type,
          amount: data.amount,
          fromAccountId: data.fromAccountId,
          fromCategoryId: data.fromCategoryId,
          toAccountId: data.toAccountId,
          toCategoryId: data.toCategoryId,
          partnerId: data.partnerId,
          remark: data.remark,
          createdBy: data.userId as string,
          updatedBy: data.userId,
        },
      });

      if (!transaction) {
        throw new Error(Messages.CREATE_TRANSACTION_FAILED);
      }

      await this.accountRepository.deductBalance(
        tx,
        data.fromAccountId as string,
        data.amount as number,
      );

      if (Array.isArray(data.products) && data.products.length > 0) {
        const products = data.products as { id: string }[];

        await this.createProductTransaction(
          tx,
          transaction,
          products,
          data.userId as string,
          data.type,
        );
      }

      return transaction;
    });
  }

  async createTransaction_Income(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: data.fromCategoryId as string },
      });
      if (!category) {
        throw new Error(Messages.CATEGORY_NOT_FOUND);
      }
      if (category.type !== CategoryType.Income) {
        throw new Error(Messages.INVALID_CATEGORY_TYPE_INCOME);
      }

      const account = await tx.account.findUnique({ where: { id: data.toAccountId as string } });
      if (!account) {
        throw new Error(Messages.ACCOUNT_NOT_FOUND);
      }

      if (account.type !== AccountType.Payment) {
        throw new Error(Messages.INVALID_ACCOUNT_TYPE_FOR_INCOME);
      }

      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          date: data.date,
          type: data.type,
          amount: data.amount,
          fromAccountId: data.fromAccountId,
          fromCategoryId: data.fromCategoryId,
          toAccountId: data.toAccountId,
          toCategoryId: data.toCategoryId,
          partnerId: data.partnerId,
          remark: data.remark,
          createdBy: data.userId as string,
          updatedBy: data.userId,
        },
      });

      if (!transaction) {
        throw new Error(Messages.CREATE_TRANSACTION_FAILED);
      }

      await this.accountRepository.receiveBalance(
        tx,
        data.toAccountId as string,
        data.amount as number,
      );

      if (Array.isArray(data.products) && data.products.length > 0) {
        const products = data.products as { id: string }[];

        await this.createProductTransaction(
          tx,
          transaction,
          products,
          data.userId as string,
          data.type,
        );
      }

      return transaction;
    });
  }

  async createTransaction_Transfer(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findUnique({
        where: { id: data.fromAccountId as string },
      });
      const toAccount = await tx.account.findUnique({
        where: { id: data.toAccountId as string },
      });

      if (!fromAccount || !toAccount) {
        throw new Error(Messages.ACCOUNT_NOT_FOUND);
      }

      const type = fromAccount.type;
      BooleanUtils.chooseByMap(
        type,
        {
          [AccountType.Payment]: () =>
            this.validatePaymentAccount(fromAccount, data.amount as number),
          [AccountType.Saving]: () =>
            this.validatePaymentAccount(fromAccount, data.amount as number),
          [AccountType.Lending]: () =>
            this.validatePaymentAccount(fromAccount, data.amount as number),
          [AccountType.CreditCard]: () =>
            this.validateCreditCardAccount(fromAccount, data.amount as number),
        },
        () => {
          throw new Error(Messages.UNSUPPORTED_ACCOUNT_TYPE.replace('{type}', type));
        },
      );

      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          date: data.date,
          type: data.type,
          amount: data.amount,
          fromAccountId: data.fromAccountId,
          fromCategoryId: data.fromCategoryId,
          toAccountId: data.toAccountId,
          toCategoryId: data.toCategoryId,
          partnerId: data.partnerId,
          remark: data.remark,
          createdBy: data.userId as string,
          updatedBy: data.userId,
        },
      });

      if (!transaction) {
        throw new Error(Messages.CREATE_TRANSACTION_FAILED);
      }

      await this.accountRepository.transferBalance(
        tx,
        data.fromAccountId as string,
        data.toAccountId as string,
        data.amount as number,
      );

      return transaction;
    });
  }

  private validatePaymentAccount(account: Account, amount: number) {
    if (account.balance!.toNumber() < amount) {
      throw new Error(
        'Payment Account must have balance equal to or greater than the transaction amount.',
      );
    }
  }

  async createProductTransaction(
    tx: Prisma.TransactionClient,
    transaction: Transaction,
    products: { id: string }[],
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type: TransactionType,
  ) {
    if (!products || products.length === 0) {
      return;
    }

    const amount = transaction.amount.toNumber();
    const productIds = products.map((p) => p.id);
    const splitAmount = amount / productIds.length;

    const existingProducts = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    if (existingProducts.length !== productIds.length) {
      throw new Error(Messages.PRODUCT_NOT_FOUND);
    }

    await tx.productTransaction.createMany({
      data: productIds.map((productId) => ({
        productId,
        transactionId: transaction.id,
        createdBy: userId,
        updatedBy: userId,
      })),
    });

    for (const product of existingProducts) {
      await tx.product.update({
        where: { id: product.id },
        data: { price: product.price.toNumber() + splitAmount },
      });
    }
  }

  private validateCreditCardAccount(account: Account, amount: number) {
    const limit = account.limit!.toNumber();
    const balance = account.balance!.toNumber();
    const availableCredit = limit - balance;

    if (availableCredit - amount < 0) {
      throw new Error('Credit Card does not have enough available credit limit.');
    }
  }
}

export const transactionUseCase = new TransactionUseCase(
  transactionRepository,
  accountRepository,
  categoryRepository,
);
