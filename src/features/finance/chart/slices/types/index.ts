import { FinanceByCategoryResult, FinanceByDate } from '../../domain/entities';

interface FinanceControlState {
  isLoadingGetFinance: boolean;
  isLoadingGetFinanceByCategory: boolean;
  financeByDate: FinanceByDate[];
  financeByCategory: FinanceByCategoryResult[];
}

export const initialFinanceControlState: FinanceControlState = {
  isLoadingGetFinance: false,
  isLoadingGetFinanceByCategory: false,
  financeByDate: [],
  financeByCategory: [],
};
