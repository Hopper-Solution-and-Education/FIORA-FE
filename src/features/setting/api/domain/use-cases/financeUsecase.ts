import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { IPartnerRepository } from '@/features/partner/domain/repositories/partnerRepository.interface';
import { partnerRepository } from '@/features/partner/infrastructure/repositories/partnerRepository';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { GetFinanceReportRequest } from '@/features/setting/data/module/finance/dto/request/GetFinanceReportRequest';
import {
  AccountFinanceReportResponse,
  GetFinanceReportResponse,
  PartnerFinanceReportResponse,
  ProductFinanceReportResponse,
} from '@/features/setting/data/module/finance/dto/response/GetFinanceReportResponse';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { TransactionType } from '@prisma/client';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';
import { productRepository } from '../../infrastructure/repositories/productRepository';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';
import { IProductRepository } from '../../repositories/productRepository.interface';
import { Messages } from '@/shared/constants/message';
import { formatMessage } from '@/shared/utils/messageUtils';

export class FinanceUseCase {
  constructor(
    private _categoryRepository: ICategoryRepository = categoryRepository,
    private _accountRepository: IAccountRepository = accountRepository,
    private _productRepository: IProductRepository = productRepository,
    private _partnerRepository: IPartnerRepository = partnerRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
  ) {}

  async getReport({ request, userId }: { request: GetFinanceReportRequest; userId: string }) {
    const { type } = request;

    switch (type) {
      case FinanceReportEnum.ACCOUNT:
        return this.getAccountReport(userId);
      case FinanceReportEnum.PARTNER:
        return this.getPartnerReport(userId);
      case FinanceReportEnum.PRODUCT:
        return this.getProductReport(userId);
      default:
        throw new Error(formatMessage(Messages.INVALID_FINANCE_REPORT_TYPE, { type }));
    }
  }

  private async getAccountReport(
    userId: string,
  ): Promise<GetFinanceReportResponse<AccountFinanceReportResponse>> {
    const allAccounts = await this._accountRepository.findMany({ userId }, {});

    const mainAccounts = allAccounts.filter((account) => !account.parentId);

    const accountTotalMap = new Map<string, number>();

    mainAccounts.forEach((account) => {
      accountTotalMap.set(account.id, Number(account.balance || 0));
    });

    allAccounts
      .filter((account) => account.parentId)
      .forEach((subAccount) => {
        if (subAccount.parentId) {
          const currentTotal = accountTotalMap.get(subAccount.parentId) || 0;
          accountTotalMap.set(subAccount.parentId, currentTotal + Number(subAccount.balance || 0));
        }
      });

    const result: AccountFinanceReportResponse[] = mainAccounts.map((account) => {
      const totalAmount = accountTotalMap.get(account.id) || 0;
      return {
        ...account,
        totalAmount,
        itemType: totalAmount >= 0 ? 'Income' : 'Expense',
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
    const allPartners = await this._partnerRepository.getPartnersByUserId(userId);

    const mainPartners = allPartners.filter((partner) => !partner.parentId);

    const transactions = await this._transactionRepository.findManyTransactions({
      userId,
      partnerId: { in: allPartners.map((partner) => partner.id) },
      isDeleted: false,
    });

    const partnerTotalMap = new Map<string, { expense: number; income: number }>();

    mainPartners.forEach((partner) => {
      partnerTotalMap.set(partner.id, { expense: 0, income: 0 });
    });

    transactions.forEach((transaction) => {
      if (!transaction.partnerId) return;

      let currentPartnerId = transaction.partnerId;
      let currentPartner = allPartners.find((p) => p.id === currentPartnerId);

      while (currentPartner?.parentId) {
        currentPartnerId = currentPartner.parentId;
        currentPartner = allPartners.find((p) => p.id === currentPartnerId);
      }

      if (!partnerTotalMap.has(currentPartnerId)) return;

      const totals = partnerTotalMap.get(currentPartnerId)!;
      const amount = Number(transaction.amount);

      if (transaction.type === TransactionType.Expense) {
        totals.expense += amount;
      } else if (transaction.type === TransactionType.Income) {
        totals.income += amount;
      }
    });

    const result: PartnerFinanceReportResponse[] = mainPartners.map((partner) => {
      const totals = partnerTotalMap.get(partner.id) || { expense: 0, income: 0 };
      const totalAmount = totals.income - totals.expense;

      return {
        ...partner,
        totalAmount,
        itemType: totalAmount >= 0 ? 'Income' : 'Expense',
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
        const amount = Number(pt.amount);

        if (pt.type === TransactionType.Expense) {
          totals.expense += amount;
        } else if (pt.type === TransactionType.Income) {
          totals.income += amount;
        }
      });
    });

    const result: ProductFinanceReportResponse[] = allProducts.map((product) => {
      const totals = productTotalMap.get(product.id) || { expense: 0, income: 0 };
      const totalAmount = totals.income - totals.expense;

      return {
        ...product,
        totalAmount,
        itemType: totalAmount >= 0 ? 'Income' : 'Expense',
      };
    });

    return {
      reportType: FinanceReportEnum.PRODUCT,
      result,
    };
  }
}

export const financeUseCase = new FinanceUseCase();
