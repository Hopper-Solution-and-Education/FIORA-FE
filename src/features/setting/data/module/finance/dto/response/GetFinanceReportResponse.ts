import { CategoryExtras } from '@/shared/types/category.types';
import { Account, Currency, Partner, Product } from '@prisma/client';
import { FinanceReportEnum } from '../../constant/FinanceReportEnum';

export interface GetFinanceReportResponse<T> {
  reportType: FinanceReportEnum;
  result: T[];
}

export interface AccountFinanceReportResponse extends Account {
  totalIncome: number;
  totalExpense: number;
  currency: Currency;
}

export interface PartnerFinanceReportResponse extends Partner {
  totalIncome: number;
  totalExpense: number;
  currency: Currency;
}

export interface ProductFinanceReportResponse extends Product {
  totalIncome: number;
  totalExpense: number;
  currency: Currency;
}

export interface CategoryFinanceReportResponse extends CategoryExtras {
  totalIncome: number;
  totalExpense: number;
  currency: Currency;
}
