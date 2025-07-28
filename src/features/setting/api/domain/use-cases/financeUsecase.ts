import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { IPartnerRepository } from '@/features/partner/domain/repositories/partnerRepository.interface';
import { partnerRepository } from '@/features/partner/infrastructure/repositories/partnerRepository';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { GetFinanceReportRequest } from '@/features/setting/data/module/finance/dto/request/GetFinanceReportRequest';
import {
  AccountFinanceReportResponse,
  CategoryFinanceReportResponse,
  GetFinanceReportResponse,
  PartnerFinanceReportResponse,
  ProductFinanceReportResponse,
} from '@/features/setting/data/module/finance/dto/response/GetFinanceReportResponse';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { formatMessage } from '@/shared/utils/messageUtils';
import { CategoryType, Currency, TransactionType } from '@prisma/client';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';
import { productRepository } from '../../infrastructure/repositories/productRepository';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';
import { IProductRepository } from '../../repositories/productRepository.interface';

export class FinanceUseCase {
  constructor(
    private _categoryRepository: ICategoryRepository = categoryRepository,
    private _accountRepository: IAccountRepository = accountRepository,
    private _productRepository: IProductRepository = productRepository,
    private _partnerRepository: IPartnerRepository = partnerRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
  ) { }

  async getReport({ request, userId }: { request: GetFinanceReportRequest; userId: string }) {
    const { type, filter = FinanceReportFilterEnum.ALL } = request;

    switch (type) {
      case FinanceReportEnum.ACCOUNT:
        return this.getAccountReport(userId);
      case FinanceReportEnum.PARTNER:
        return this.getPartnerReport(userId);
      case FinanceReportEnum.PRODUCT:
        return this.getProductReport(userId);
      case FinanceReportEnum.CATEGORY:
        return this.getCategoryReport(userId, filter);
      default:
        throw new Error(formatMessage(Messages.INVALID_FINANCE_REPORT_TYPE, { type }));
    }
  }

  private async getAccountReport(
    userId: string,
  ): Promise<GetFinanceReportResponse<AccountFinanceReportResponse>> {
    const allAccounts = await this._accountRepository.findMany({ userId });

    const result: AccountFinanceReportResponse[] = allAccounts.map((account) => {
      const baseAmount = Number(account.baseAmount || 0);
      const totalIncome = baseAmount > 0 ? baseAmount : 0;
      const totalExpense = baseAmount < 0 ? -baseAmount : 0;
      const totalProfit = 0;

      return {
        ...account,
        totalIncome,
        totalExpense,
        totalProfit,
        currency: account.currency,
      };
    });

    return {
      reportType: FinanceReportEnum.ACCOUNT,
      result,
    };
  }

  private async getPartnerReport(
    userId: string,
  ): Promise<GetFinanceReportResponse<PartnerFinanceReportResponse>> {
    const allPartners = await this._partnerRepository.getPartnersByUserId(userId, {
      transactions: false,
      children: false,
      parent: false,
      user: false,
    });

    const transactions = await this._transactionRepository.findManyTransactions({
      userId,
      partnerId: { in: allPartners.map((partner) => partner.id) },
      isDeleted: false,
    });

    const partnerTotalMap = new Map<string, { expense: number; income: number }>();

    allPartners.forEach((partner) => {
      partnerTotalMap.set(partner.id, { expense: 0, income: 0 });
    });

    transactions.forEach((transaction) => {
      if (!transaction.partnerId || !partnerTotalMap.has(transaction.partnerId)) return;

      const totals = partnerTotalMap.get(transaction.partnerId)!;
      const baseAmount = Number(transaction.baseAmount);

      if (transaction.type === TransactionType.Expense) {
        totals.expense += baseAmount;
      } else if (transaction.type === TransactionType.Income) {
        totals.income += baseAmount;
      }
    });

    const result: PartnerFinanceReportResponse[] = allPartners.map((partner) => {
      const totals = partnerTotalMap.get(partner.id) || { expense: 0, income: 0 };
      const totalProfit = totals.income - totals.expense;

      return {
        ...partner,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        totalProfit,
        currency: Currency.VND,
      };
    });

    return {
      reportType: FinanceReportEnum.PARTNER,
      result,
    };
  }

  private async getProductReport(
    userId: string,
  ): Promise<GetFinanceReportResponse<ProductFinanceReportResponse>> {
    const allProducts = await this._productRepository.findManyProducts({ userId });

    const productTransactions = await this._transactionRepository.findProductTransactions(userId);

    const productTotalMap = new Map<string, { expense: number; income: number }>();

    allProducts.forEach((product) => {
      productTotalMap.set(product.id, { expense: 0, income: 0 });
    });

    productTransactions.forEach((pt) => {
      pt.productsRelation.forEach((relation) => {
        if (!productTotalMap.has(relation.productId)) return;

        const totals = productTotalMap.get(relation.productId)!;
        const baseAmount = Number(pt.baseAmount);

        if (pt.type === TransactionType.Expense) {
          totals.expense += baseAmount;
        } else if (pt.type === TransactionType.Income) {
          totals.income += baseAmount;
        }
      });
    });

    const result: ProductFinanceReportResponse[] = allProducts.map((product) => {
      const totals = productTotalMap.get(product.id) || { expense: 0, income: 0 };
      const totalProfit = totals.income - totals.expense;

      return {
        ...product,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        totalProfit,
        currency: product.currency,
      };
    });

    return {
      reportType: FinanceReportEnum.PRODUCT,
      result,
    };
  }

  private async getCategoryReport(
    userId: string,
    filter: FinanceReportFilterEnum = FinanceReportFilterEnum.ALL,
  ): Promise<GetFinanceReportResponse<CategoryFinanceReportResponse>> {
    const allCategories = await this._categoryRepository.findCategoriesWithTransactions(userId);

    const categoryTotalMap = new Map<string, { expense: number; income: number }>();

    allCategories.forEach((category) => {
      categoryTotalMap.set(category.id, { expense: 0, income: 0 });
    });

    allCategories.forEach((category) => {
      const totals = categoryTotalMap.get(category.id)!;

      if (category.type === CategoryType.Expense) {
        const expenseAmount = (category.toTransactions || []).reduce(
          (sum, tx) => sum + Number(tx.baseAmount),
          0,
        );
        totals.expense += expenseAmount;
      } else if (category.type === CategoryType.Income) {
        const incomeAmount = (category.fromTransactions || []).reduce(
          (sum, tx) => sum + Number(tx.baseAmount),
          0,
        );
        totals.income += incomeAmount;
      }
    });

    let result: CategoryFinanceReportResponse[] = allCategories.map((category) => {
      const totals = categoryTotalMap.get(category.id) || { expense: 0, income: 0 };
      const totalProfit = totals.income - totals.expense;

      return {
        ...category,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        totalProfit,
        currency: Currency.VND,
      };
    });

    if (filter === FinanceReportFilterEnum.INCOME) {
      result = result.filter((category) => category.totalIncome > 0);
    } else if (filter === FinanceReportFilterEnum.EXPENSE) {
      result = result.filter((category) => category.totalExpense > 0);
    }

    return {
      reportType: FinanceReportEnum.CATEGORY,
      result,
    };
  }

  async getReportByIds({
    ids,
    type,
    userId,
  }: {
    ids: string[];
    type: FinanceReportEnum;
    userId: string;
  }) {
    switch (type) {
      case FinanceReportEnum.ACCOUNT:
        return this.getAccountReportByIds(userId, ids);
      case FinanceReportEnum.PARTNER:
        return this.getPartnerReportByIds(userId, ids);
      case FinanceReportEnum.PRODUCT:
        return this.getProductReportByIds(userId, ids);
      default:
        throw new Error(formatMessage(Messages.INVALID_FINANCE_REPORT_TYPE, { type }));
    }
  }

  private async getAccountReportByIds(
    userId: string,
    accountIds: string[],
  ): Promise<GetFinanceReportResponse<AccountFinanceReportResponse>> {
    const allAccounts = await this._accountRepository.findMany({ userId, id: { in: accountIds } });

    const result: AccountFinanceReportResponse[] = allAccounts.map((account) => {
      const baseAmount = Number(account.baseAmount || 0);
      const totalIncome = baseAmount > 0 ? baseAmount : 0;
      const totalExpense = baseAmount < 0 ? -baseAmount : 0;
      const totalProfit = 0;

      return {
        ...account,
        totalIncome,
        totalExpense,
        totalProfit,
        currency: account.currency,
      };
    });

    return {
      reportType: FinanceReportEnum.ACCOUNT,
      result,
    };
  }

  private async getPartnerReportByIds(
    userId: string,
    partnerIds: string[],
  ): Promise<GetFinanceReportResponse<PartnerFinanceReportResponse>> {
    const allPartners = await this._partnerRepository.getPartnersByUserId(
      userId,
      {
        transactions: false,
        children: false,
        parent: false,
        user: false,
      },
      { id: { in: partnerIds } },
    );

    const transactions = await this._transactionRepository.findManyTransactions({
      userId,
      partnerId: { in: partnerIds },
      isDeleted: false,
    });

    const partnerTotalMap = new Map<string, { expense: number; income: number }>();

    allPartners.forEach((partner) => {
      partnerTotalMap.set(partner.id, { expense: 0, income: 0 });
    });

    transactions.forEach((transaction) => {
      if (!transaction.partnerId || !partnerTotalMap.has(transaction.partnerId)) return;

      const totals = partnerTotalMap.get(transaction.partnerId)!;
      const baseAmount = Number(transaction.baseAmount);

      if (transaction.type === TransactionType.Expense) {
        totals.expense += baseAmount;
      } else if (transaction.type === TransactionType.Income) {
        totals.income += baseAmount;
      }
    });

    const result: PartnerFinanceReportResponse[] = allPartners.map((partner) => {
      const totals = partnerTotalMap.get(partner.id) || { expense: 0, income: 0 };
      const totalProfit = totals.income - totals.expense;

      return {
        ...partner,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        totalProfit,
        currency: Currency.VND,
      };
    });

    return {
      reportType: FinanceReportEnum.PARTNER,
      result,
    };
  }

  private async getProductReportByIds(
    userId: string,
    productIds: string[],
  ): Promise<GetFinanceReportResponse<ProductFinanceReportResponse>> {
    const allProducts = await this._productRepository.findManyProducts({
      userId,
      id: { in: productIds },
    });

    const productTransactions = await this._transactionRepository.findProductTransactions(userId);

    const productTotalMap = new Map<string, { expense: number; income: number }>();

    allProducts.forEach((product) => {
      productTotalMap.set(product.id, { expense: 0, income: 0 });
    });

    productTransactions.forEach((pt) => {
      pt.productsRelation.forEach((relation) => {
        if (!productTotalMap.has(relation.productId)) return;

        const totals = productTotalMap.get(relation.productId)!;
        const baseAmount = Number(pt.baseAmount);

        if (pt.type === TransactionType.Expense) {
          totals.expense += baseAmount;
        } else if (pt.type === TransactionType.Income) {
          totals.income += baseAmount;
        }
      });
    });

    const result: ProductFinanceReportResponse[] = allProducts.map((product) => {
      const totals = productTotalMap.get(product.id) || { expense: 0, income: 0 };
      const totalProfit = totals.income - totals.expense;

      return {
        ...product,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        totalProfit,
        currency: product.currency,
      };
    });

    return {
      reportType: FinanceReportEnum.PRODUCT,
      result,
    };
  }
}

export const financeUseCase = new FinanceUseCase();
