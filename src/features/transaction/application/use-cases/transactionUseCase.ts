import {
  AccountType,
  CategoryType,
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
import { BooleanUtils } from '@/lib/booleanUtils';

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

  async createTransaction_Expense(data: Prisma.TransactionUncheckedCreateInput) {
    const account = await this.accountRepository.findById(data.fromAccountId as string);
    if (!account) {
      throw new Error("Can't find account");
    }

    const type = account.type;
    if (type !== AccountType.Payment && type !== AccountType.CreditCard) {
      throw new Error('Mismatched account type. Only Payment or CreditCard accounts are allowed.');
    }

    BooleanUtils.chooseByMap(
      type,
      {
        [AccountType.Payment]: () => this.validatePaymentAccount(account, data.amount as number),
        [AccountType.CreditCard]: () =>
          this.validateCreditCardAccount(account, data.amount as number),
      },
      () => {
        throw new Error(`AccountType ${type} không được hỗ trợ`);
      },
    );

    if (!data.toCategoryId) {
      throw new Error('Expense Category is required for Expense transaction.');
    }

    const category = await this.categoryRepository.findCategoryById(data.toCategoryId as string);
    if (!category) {
      throw new Error("Can't find category");
    }
    if (category.type !== CategoryType.Expense) {
      throw new Error('To field must be an Expense Category.');
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
    return transaction;
  }

  async createTransaction_Income(data: Prisma.TransactionUncheckedCreateInput) {
    const category = await this.categoryRepository.findCategoryById(data.toCategoryId as string);
    if (!category) {
      throw new Error("Can't find category");
    }
    if (category.type !== CategoryType.Income) {
      throw new Error('Category type must be Income.');
    }

    const account = await this.accountRepository.findById(data.fromAccountId as string);
    if (!account) {
      throw new Error("Can't find account");
    }
    const type = account.type;
    if (type !== AccountType.Payment) {
      throw new Error('Mismatched account type. Only Payment or CreditCard accounts are allowed.');
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

    return transaction;
  }

  async createTransaction_Transfer(data: Prisma.TransactionUncheckedCreateInput) {
    const category = await this.categoryRepository.findCategoryById(data.toCategoryId as string);
    if (!category) {
      throw new Error("Can't find category");
    }
    if (category.type !== CategoryType.Income) {
      throw new Error('Category type must be Income.');
    }

    const fromAccount = await this.accountRepository.findByCondition({
      id: data.fromAccountId as string,
      userId: data.userId as string,
    });
    const toAccount = await this.accountRepository.findById(data.toAccountId as string);
    if (!fromAccount || !toAccount) {
      throw new Error("Can't find account");
    }
    const type = fromAccount.type;

    BooleanUtils.chooseByMap(
      type,
      {
        [AccountType.Payment]: () =>
          this.validatePaymentAccount(fromAccount, data.amount as number),
        [AccountType.Saving]: () => this.validatePaymentAccount(fromAccount, data.amount as number),
        [AccountType.Lending]: () =>
          this.validatePaymentAccount(fromAccount, data.amount as number),
        [AccountType.CreditCard]: () =>
          this.validateCreditCardAccount(fromAccount, data.amount as number),
      },
      () => {
        throw new Error(`AccountType ${type} không được hỗ trợ`);
      },
    );

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

    return transaction;
  }

  private validatePaymentAccount(account: Account, amount: number) {
    if (account.balance!.toNumber() < amount) {
      throw new Error(
        'Payment Account must have balance equal to or greater than the transaction amount.',
      );
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
