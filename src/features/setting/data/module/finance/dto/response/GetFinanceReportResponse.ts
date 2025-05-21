import { Account, Partner, Product } from '@prisma/client';
import { FinanceReportEnum } from '../../constant/FinanceReportEnum';

export interface GetFinanceReportResponse<T> {
  reportType: FinanceReportEnum;
  result: T[];
}

export interface AccountFinanceReportResponse extends Account {
  totalAmount: number;
  itemType: 'Expense' | 'Income';
}

export interface PartnerFinanceReportResponse extends Partner {
  totalAmount: number;
  itemType: 'Expense' | 'Income';
}

export interface ProductFinanceReportResponse extends Product {
  totalAmount: number;
  itemType: 'Expense' | 'Income';
}
