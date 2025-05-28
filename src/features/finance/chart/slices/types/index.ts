import { FinanceByDate, FinanceResult } from '../../domain/entities';

export type ViewBy = 'date' | 'category' | 'account' | 'product' | 'partner';
export type ViewChartByCategory = 'income' | 'expense';
interface FinanceControlState {
  isLoadingGetFinance: boolean;
  viewBy: ViewBy;
  viewChartByCategory: 'income' | 'expense';
  financeByDate: FinanceByDate[];
  financeByCategory: FinanceResult[];
  financeByAccount: FinanceResult[];
  financeByProduct: FinanceResult[];
  financeByPartner: FinanceResult[];
}

export const initialFinanceControlState: FinanceControlState = {
  isLoadingGetFinance: false,
  viewBy: 'date',
  viewChartByCategory: 'income',
  financeByDate: [],
  financeByCategory: [],
  financeByAccount: [],
  financeByProduct: [],
  financeByPartner: [],
};
