import { CategoryExtras } from '@/shared/types/category.types';
import { Account, Partner, Product } from '@prisma/client';
import { FinanceReportEnum } from '../../constant/FinanceReportEnum';

export interface GetFinanceReportResponse<T> {
  reportType: FinanceReportEnum;
  result: T[];
}

export interface BaseFinanceReportResponse {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  currency: string;
}

export interface AccountFinanceReportResponse
  extends Omit<Account, 'currency'>,
    BaseFinanceReportResponse {}

export type PartnerFinanceReportResponse = Partner & BaseFinanceReportResponse;

export interface ProductFinanceReportResponse
  extends Omit<Product, 'currency'>,
    BaseFinanceReportResponse {}

export interface CategoryFinanceReportResponse extends CategoryExtras, BaseFinanceReportResponse {}
