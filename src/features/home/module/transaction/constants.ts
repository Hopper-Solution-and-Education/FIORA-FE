import { TransactionState } from './types/transaction';

export const transactionInitialState: TransactionState = {
  transactions: {
    data: null,
    isLoading: false,
    error: null,
  },
  maxBalance: 0,
  filterCriteria: {
    filters: {},
    userId: '',
    sortBy: {},
  },
  deleteConfirmOpen: false,
  selectedTransaction: null,
};
