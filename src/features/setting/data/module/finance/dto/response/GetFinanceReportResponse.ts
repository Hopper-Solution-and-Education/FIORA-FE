import { CategoryExtras } from '@/shared/types/category.types';
import { Account, Currency, Partner, Product } from '@prisma/client';
import { FinanceReportEnum } from '../../constant/FinanceReportEnum';

export interface GetFinanceReportResponse<T> {
  reportType: FinanceReportEnum;
  result: T[];
}

export interface BaseFinanceReportResponse {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  currency: Currency;
}

export interface AccountFinanceReportResponse
  extends Omit<Account, 'currency'>,
    BaseFinanceReportResponse {}

export interface PartnerFinanceReportResponse extends Partner, BaseFinanceReportResponse {}

export interface ProductFinanceReportResponse
  extends Omit<Product, 'currency'>,
    BaseFinanceReportResponse {}

export interface CategoryFinanceReportResponse extends CategoryExtras, BaseFinanceReportResponse {}
