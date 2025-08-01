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

export type AccountFinanceReportResponse = Omit<Account, 'currency'> & BaseFinanceReportResponse;

export type PartnerFinanceReportResponse = Partner & BaseFinanceReportResponse;

export type ProductFinanceReportResponse = Omit<Product, 'currency'> & BaseFinanceReportResponse;

export interface CategoryFinanceReportResponse extends CategoryExtras, BaseFinanceReportResponse { }
