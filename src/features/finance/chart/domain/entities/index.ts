import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { HttpResponse } from '@/shared/types';

export * from './Account';
export * from './Partner';
export * from './Product';

export type GetFinanceByDateRequest = {
  from: string;
  to: string;
};

export type GetFinanceByDateResponse = FinanceByDate[];

export type FinanceByDate = {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  currency: string;
};

export type GetFinanceByCategoryRequest = {
  type: FinanceReportEnum;
  filter: FinanceReportFilterEnum;
};

export type GetFinanceWithFilterRequest = {
  type: FinanceReportEnum;
  ids: string[];
};

export type GetFinanceWithFilterResponse = HttpResponse<FinanceByCategory>;

export type GetFinanceByCategoryResponse = HttpResponse<FinanceByCategory>;

export type FinanceByCategory = {
  reportType: FinanceReportEnum;
  result: FinanceResult[];
};

export type FinanceResult = {
  name: string;
  icon?: string;
  currency: string;
  logo?: string;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  balance?: number;
};
