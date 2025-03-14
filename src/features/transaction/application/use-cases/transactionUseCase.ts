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
import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { ICategoryRepository } from '@/features/setting/domain/repositories/categoryRepository.interface';
import { categoryRepository } from '@/features/setting/infrastructure/repositories/categoryRepository';
import { BooleanUtils } from '@/config/booleanUtils';
import { Messages } from '@/config/message';
import prisma from '@/infrastructure/database/prisma';

class TransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async listTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.getTransactionsByUserId(userId);
  }

  async viewTransaction(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error(Messages.INTERNAL_ERROR);
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
      throw new Error(Messages.INTERNAL_ERROR);
    }
    return this.transactionRepository.updateTransaction(id, userId, data);
  }

  async removeTransaction(id: string, userId: string): Promise<void> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error(Messages.INTERNAL_ERROR);
    }
    await this.transactionRepository.deleteTransaction(id, userId);
  }

  async createTransaction(data: Prisma.TransactionUncheckedCreateInput) {
    // Map các loại transaction với hàm xử lý tương ứng
    const transactionHandlers: Record<
      TransactionType,
      (data: Prisma.TransactionUncheckedCreateInput) => Promise<any>
    > = {
      [TransactionType.Expense]: this.createTransaction_Expense.bind(this),
      [TransactionType.Income]: this.createTransaction_Income.bind(this),
      [TransactionType.Transfer]: this.createTransaction_Transfer.bind(this),
    };

    // Lấy hàm xử lý theo type
    const handler = transactionHandlers[data.type as TransactionType];

    if (!handler) {
      throw new Error(Messages.INVALID_TRANSACTION_TYPE);
    }

    return handler(data);
  }

  async createTransaction_Expense(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      const account = await this.accountRepository.findById(data.fromAccountId as string);
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

      const category = await this.categoryRepository.findCategoryById(data.toCategoryId as string);
      if (!category || category.type !== CategoryType.Expense) {
        throw new Error(Messages.INVALID_CATEGORY_TYPE_EXPENSE);
      }

      const transaction = await this.transactionRepository.createTransaction({
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
      });

      if (!transaction) {
        throw new Error(Messages.CREATE_TRANSACTION_FAILED);
      }

      await this.accountRepository.deductBalance(
        tx,
        data.fromAccountId as string,
        data.amount as number,
      );

      // Gọi hàm tạo quan hệ ProductTransaction
      if (Array.isArray(data.products) && data.products.length > 0) {
        const products = data.products as { id: string }[];

        await this.createProductTransaction(tx, transaction.id, products, data.userId as string);
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

      // Xử lý ProductTransaction nếu có sản phẩm
      if (Array.isArray(data.products) && data.products.length > 0) {
        const products = data.products as { id: string }[];

        await this.createProductTransaction(tx, transaction.id, products, data.userId as string);
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
    transactionId: string,
    products: { id: string }[],
    userId: string,
  ) {
    if (!products || products.length === 0) {
      throw new Error(Messages.NO_PRODUCTS_PROVIDED);
    }

    const productIds = products.map((p) => p.id);

    // Kiểm tra xem tất cả sản phẩm có tồn tại không
    const existingProducts = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    if (existingProducts.length !== productIds.length) {
      throw new Error(Messages.PRODUCT_NOT_FOUND);
    }

    // Tạo các bản ghi trong bảng ProductTransaction
    await tx.productTransaction.createMany({
      data: productIds.map((productId) => ({
        productId,
        transactionId,
        createdBy: userId,
        updatedBy: userId,
      })),
    });
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
