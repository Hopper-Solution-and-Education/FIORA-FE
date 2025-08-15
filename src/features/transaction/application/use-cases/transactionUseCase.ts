import { prisma } from '@/config';
import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { currencySettingRepository } from '@/features/setting/api/infrastructure/repositories/currencySettingRepository';
import { ICurrencySettingRepository } from '@/features/setting/api/repositories/currencySettingRepository.interface';
import { DEFAULT_BASE_CURRENCY } from '@/shared/constants';
import { Messages } from '@/shared/constants/message';
import { BadRequestError, ConflictError, InternalServerError } from '@/shared/lib';
import { BooleanUtils } from '@/shared/lib/booleanUtils';
import { PaginationResponse } from '@/shared/types/Common.types';
import { TransactionGetPagination } from '@/shared/types/transaction.types';
import { buildOrderByTransactionV2, buildWhereClause } from '@/shared/utils';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import {
  AccountType,
  CategoryType,
  Prisma,
  TransactionType,
  type Account,
  type Transaction,
} from '@prisma/client';
import { ITransactionRepository } from '../../domain/repositories/transactionRepository.interface';
import { transactionRepository } from '../../infrastructure/repositories/transactionRepository';

class TransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository,
    private currencySettingRepository: ICurrencySettingRepository,
  ) { }

  async listTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.getTransactionsByUserId(userId);
  }

  async getTransactions(params: Partial<TransactionGetPagination>) {
    const { searchParams = '', filters, sortBy = {}, userId } = params;

    let where = buildWhereClause(filters) as Prisma.TransactionWhereInput;
    if (searchParams) {
      const typeSearchParams = searchParams.toLowerCase();
      // test with Regex-Type Transaction
      const regex = new RegExp('^' + typeSearchParams, 'i'); // ^: start with, i: ignore case
      const typeTransaction = Object.values(TransactionType).find((type) => regex.test(type));

      let typeTransactionWhere = '';

      if (typeTransaction) {
        typeTransactionWhere = typeTransaction;
      }

      // test with Regex-Date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
      const date = new Date(typeSearchParams);
      const isSearchDate = dateRegex.test(typeSearchParams) && !isNaN(date.getTime());

      where = {
        AND: [
          where,
          {
            OR: [
              { fromAccount: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              { toAccount: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              { partner: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              {
                amount: { gte: Number(typeSearchParams) || 0, lte: Number(typeSearchParams) || 0 },
              },
              // adding typeTransactionWhere to where clause if exists
              ...(typeTransactionWhere
                ? [{ type: typeTransactionWhere as unknown as TransactionType }]
                : []),
              ...(isSearchDate
                ? [
                  {
                    date: {
                      gte: new Date(typeSearchParams),
                      lte: new Date(new Date(typeSearchParams).setHours(23, 59, 59)),
                    },
                  },
                ]
                : []),
            ],
          },
        ],
      };
    }
    const orderBy = buildOrderByTransactionV2(sortBy);

    const transactionAwaited = this.transactionRepository.findManyTransactions(
      {
        ...where,
        isDeleted: false,
        userId,
      },
      {
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
    const totalTransactionAwaited = this.transactionRepository.count({
      ...where,
    });
    // getting amountMax from transactions
    const amountMaxAwaited = this.transactionRepository.aggregate({
      where: { userId },
      _max: { amount: true },
    });
    const amountMinAwaited = this.transactionRepository.aggregate({
      where: { userId },
      _min: { amount: true },
    });

    const [transactions, total, amountMax, amountMin] = await Promise.all([
      transactionAwaited,
      totalTransactionAwaited,
      amountMaxAwaited,
      amountMinAwaited,
    ]);

    return {
      data: transactions,
      amountMax: Number(amountMax['_max']?.amount) || 0,
      amountMin: Number(amountMin['_min']?.amount) || 0,
      total,
    };
  }

  async getTransactionsPagination(
    params: TransactionGetPagination,
  ): Promise<PaginationResponse<any> & { amountMin?: number; amountMax?: number }> {
    const { page = 1, pageSize = 20, searchParams = '', filters, sortBy = {}, userId } = params;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    let where = buildWhereClause(filters) as Prisma.TransactionWhereInput;

    if (searchParams) {
      const typeSearchParams = searchParams.toLowerCase();
      // test with Regex-Type Transaction
      const regex = new RegExp('^' + typeSearchParams, 'i'); // ^: start with, i: ignore case
      const typeTransaction = Object.values(TransactionType).find((type) => regex.test(type));

      let typeTransactionWhere = '';

      if (typeTransaction) {
        typeTransactionWhere = typeTransaction;
      }

      // test with Regex-Date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
      const date = new Date(typeSearchParams);
      const isSearchDate = dateRegex.test(typeSearchParams) && !isNaN(date.getTime());

      where = {
        AND: [
          where,
          {
            OR: [
              { fromAccount: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              { toAccount: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              { partner: { name: { contains: typeSearchParams, mode: 'insensitive' } } },
              {
                AND: [
                  {
                    baseAmount: {
                      gte: Number(typeSearchParams),
                      lte: Number(typeSearchParams),
                    },
                    baseCurrency: { equals: 'USD' },
                  },
                ],
              },
              // adding typeTransactionWhere to where clause if exists
              ...(typeTransactionWhere
                ? [{ type: typeTransactionWhere as unknown as TransactionType }]
                : []),
              ...(isSearchDate
                ? [
                  {
                    date: {
                      gte: new Date(typeSearchParams),
                      lte: new Date(new Date(typeSearchParams).setHours(23, 59, 59)),
                    },
                  },
                ]
                : []),
            ],
          },
        ],
      };
    }

    const orderBy = buildOrderByTransactionV2(sortBy);

    const transactionAwaited = this.transactionRepository.findManyTransactions(
      {
        ...where,
        isDeleted: false,
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

    const totalTransactionAwaited = this.transactionRepository.count({
      ...where,
      AND: [{ isDeleted: false }, { userId }],
    });
    // getting amountMax from transactions
    const amountMaxAwaited = this.transactionRepository.aggregate({
      where: { userId, baseCurrency: DEFAULT_BASE_CURRENCY },
      _max: { baseAmount: true },
    });

    const amountMinAwaited = this.transactionRepository.aggregate({
      where: { userId, baseCurrency: DEFAULT_BASE_CURRENCY },
      _min: { baseAmount: true },
    });

    const [transactions, total, amountMax, amountMin] = await Promise.all([
      transactionAwaited,
      totalTransactionAwaited,
      amountMaxAwaited,
      amountMinAwaited,
    ]);

    const totalPage = Math.ceil(total / pageSize);

    return {
      data: transactions as any,
      totalPage,
      page,
      pageSize,
      amountMax: Number(amountMax['_max']?.baseAmount) || 0,
      amountMin: Number(amountMin['_min']?.baseAmount) || 0,
      total,
    };
  }

  async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.getTransactionById(id, userId);
    if (!transaction) {
      throw new Error(Messages.TRANSACTION_NOT_FOUND);
    }
    return transaction;
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
    const baseAmount = transaction.baseAmount?.toNumber() || 0;

    switch (transaction.type) {
      case TransactionType.Expense:
        if (fromAccount) {
          await this.accountRepository.receiveBalance(tx, fromAccount.id, amount, baseAmount);
        }
        break;

      case TransactionType.Income:
        if (toAccount) {
          this.validateSufficientBalance(
            toAccount.balance!.toNumber(),
            amount,
            `Account ${toAccount.name} does not have sufficient balance to reverse the income transaction.`,
          );
          await this.accountRepository.deductBalance(tx, toAccount.id, amount, baseAmount);
        }
        break;

      case TransactionType.Transfer:
        if (fromAccount && toAccount) {
          this.validateSufficientBalance(
            toAccount.balance!.toNumber(),
            amount,
            `Account ${toAccount.name} does not have sufficient balance to refund the transfer transaction.`,
          );
          await this.accountRepository.transferBalance(tx, toAccount.id, fromAccount.id, amount);
        }
        break;
    }

    await this.revertProductPrices(tx, transaction);
    await tx.productTransaction.deleteMany({ where: { transactionId: transaction.id } });
  }

  async getTransactionFilterOptions(userId: string) {
    const [filterOptions, amountRange] = await Promise.all([
      this.transactionRepository.getFilterOptions(userId),
      this.fetchMinMaxTransactionAmount(userId),
    ]);

    return {
      accounts: filterOptions.accounts ?? [],
      categories: filterOptions.categories ?? [],
      partners: filterOptions.partners ?? [],
      amountMin: amountRange.min,
      amountMax: amountRange.max,
    };
  }

  async getValidCategoryAccount(userId: string, type: TransactionType) {
    const filterOptions = await this.transactionRepository.getValidCategoryAccount(userId, type);

    return {
      fromAccounts: filterOptions.fromAccounts ?? [],
      toAccounts: filterOptions.toAccounts ?? [],
      fromCategories: filterOptions.fromCategories ?? [],
      toCategories: filterOptions.toCategories ?? [],
    };
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

      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const createdAt = new Date(transaction.createdAt).getTime();
      if (now - createdAt > THIRTY_DAYS_MS) {
        throw new ConflictError(Messages.TRANSACTION_TOO_OLD_TO_DELETE);
      }

      await this.revertOldTransaction(tx, transaction);

      return await this.transactionRepository.deleteTransaction(id, userId);
    });
  }

  async createTransaction(data: Prisma.TransactionUncheckedCreateInput, currency: string) {
    const foundCurrency = await this.currencySettingRepository.findFirstCurrency({
      name: currency,
    });

    if (!foundCurrency) {
      throw new Error(Messages.CURRENCY_NOT_FOUND);
    }

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
      throw new BadRequestError(Messages.INVALID_TRANSACTION_TYPE);
    }

    data.currency = foundCurrency.name;
    data.currencyId = foundCurrency.id;

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
        throw new BadRequestError(Messages.ACCOUNT_NOT_FOUND);
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
          throw new BadRequestError(Messages.UNSUPPORTED_ACCOUNT_TYPE.replace('{type}', type));
        },
      );

      if (!data.toCategoryId) {
        throw new BadRequestError(Messages.CATEGORY_NOT_FOUND);
      }
      const category = await tx.category.findUnique({
        where: { id: data.toCategoryId as string },
      });
      if (!category || category.type !== CategoryType.Expense) {
        throw new BadRequestError(Messages.INVALID_CATEGORY_TYPE_EXPENSE);
      }

      const baseAmount = await convertCurrency(
        Number(data.amount),
        data.currency as string,
        DEFAULT_BASE_CURRENCY,
      );

      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          date: data.date,
          currencyId: data.currencyId,
          currency: data.currency,
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
          baseAmount: baseAmount,
          baseCurrency: data.baseCurrency,
        },
      });

      if (!transaction) {
        throw new InternalServerError(Messages.CREATE_TRANSACTION_FAILED);
      }

      await this.accountRepository.deductBalance(
        tx,
        data.fromAccountId as string,
        data.amount as number,
        data.baseAmount as number,
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

  async fetchMinMaxTransactionAmount(userId: string): Promise<{ min: number; max: number }> {
    const maxAmountAwaited = this.transactionRepository.aggregate({
      where: { userId },
      _max: { amount: true },
    });

    const minAmountAwaited = this.transactionRepository.aggregate({
      where: { userId },
      _min: { amount: true },
    });

    const [maxAmount, minAmount] = await Promise.all([maxAmountAwaited, minAmountAwaited]);

    let max = Number(maxAmount['_max']?.amount) || 0;
    const min = Number(minAmount['_min']?.amount) || 0;

    max = BooleanUtils.choose(
      max === 0,
      () => 100000,
      () => 0,
    );

    return {
      min,
      max,
    };
  }

  async createTransaction_Income(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: data.fromCategoryId as string },
      });

      const membershipBenefit = await tx.membershipBenefit.findUnique({
        where: { id: data.fromCategoryId as string },
      });

      if (!category && !membershipBenefit) {
        throw new BadRequestError(Messages.CATEGORY_NOT_FOUND);
      }

      if (category && category.type !== CategoryType.Income) {
        throw new BadRequestError(Messages.INVALID_CATEGORY_TYPE_INCOME);
      }

      const account = await tx.account.findUnique({ where: { id: data.toAccountId as string } });
      if (!account) {
        throw new BadRequestError(Messages.ACCOUNT_NOT_FOUND);
      }

      if (
        account.type !== AccountType.Payment &&
        account.type !== AccountType.CreditCard &&
        account.type !== AccountType.Debt
      ) {
        throw new BadRequestError(Messages.INVALID_ACCOUNT_TYPE_FOR_INCOME);
      }

      const baseAmount = await convertCurrency(
        Number(data.amount),
        data.currency as string,
        DEFAULT_BASE_CURRENCY,
      );

      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          date: data.date,
          type: data.type,
          amount: data.amount,
          currencyId: data.currencyId,
          currency: data.currency,
          fromAccountId: data.fromAccountId,
          fromCategoryId: category ? category.id : null,
          toAccountId: data.toAccountId,
          toCategoryId: data.toCategoryId,
          partnerId: data.partnerId,
          membershipBenefitId: membershipBenefit ? membershipBenefit.id : null,
          remark: data.remark,
          createdBy: data.userId as string,
          updatedBy: data.userId,
          baseAmount: baseAmount,
          baseCurrency: data.baseCurrency,
        },
      });

      if (!transaction) {
        throw new InternalServerError(Messages.CREATE_TRANSACTION_FAILED);
      }

      await this.accountRepository.receiveBalance(
        tx,
        data.toAccountId as string,
        data.amount as number,
        baseAmount,
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
          [AccountType.Debt]: () => this.validateDebtAccount(fromAccount, data.amount as number),
          [AccountType.Invest]: () =>
            this.validateInvestAccount(fromAccount, data.amount as number),
        },
        () => {
          throw new BadRequestError(Messages.UNSUPPORTED_ACCOUNT_TYPE.replace('{type}', type));
        },
      );

      const baseAmount = await convertCurrency(
        Number(data.amount),
        data.currency as string,
        DEFAULT_BASE_CURRENCY,
      );

      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          date: data.date,
          type: data.type,
          amount: data.amount,
          fromAccountId: data.fromAccountId,
          fromCategoryId: data.fromCategoryId,
          currencyId: data.currencyId,
          currency: data.currency,
          toAccountId: data.toAccountId,
          toCategoryId: data.toCategoryId,
          partnerId: data.partnerId,
          remark: data.remark,
          createdBy: data.userId as string,
          updatedBy: data.userId,
          baseAmount: baseAmount,
          baseCurrency: data.baseCurrency,
        },
      });

      if (!transaction) {
        throw new InternalServerError(Messages.CREATE_TRANSACTION_FAILED);
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
      throw new BadRequestError(
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

    if (productIds.toString() == '') {
      return;
    }

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
      throw new BadRequestError('Credit Card does not have enough available credit limit.');
    }
  }

  private validateDebtAccount(account: Account, amount: number) {
    if (account.balance!.toNumber() >= amount) {
      throw new BadRequestError('Debt Account must have balance below 0.');
    }
  }

  private validateInvestAccount(account: Account, amount: number) {
    if (account.balance!.toNumber() <= amount) {
      throw new BadRequestError('Invest Account must have balance above 0.');
    }
  }
}

export const transactionUseCase = new TransactionUseCase(
  transactionRepository,
  accountRepository,
  currencySettingRepository,
);
