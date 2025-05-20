import { FinanceByDate } from '../../domain/entities';

interface FinanceControlState {
  isLoadingGetFinance: boolean;
  financeByDate: FinanceByDate[];
}

export const initialFinanceControlState: FinanceControlState = {
  isLoadingGetFinance: false,
  financeByDate: [],
};
