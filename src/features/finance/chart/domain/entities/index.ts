import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { HttpResponse } from '@/shared/types';

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
};

export type GetFinanceByCategoryRequest = {
  type: FinanceReportEnum;
  filter: FinanceReportFilterEnum;
};

export type GetFinanceByCategoryResponse = HttpResponse<FinanceByCategory>;

export type FinanceByCategory = {
  reportType: FinanceReportEnum;
  result: FinanceResult[];
};

export type FinanceResult = {
  name: string;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
};
