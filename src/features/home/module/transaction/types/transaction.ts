import { FilterCriteria } from '@/shared/types';
import { IRelationalTransaction, ITransactionPaginatedResponse } from '.';

export type TransactionState = {
  transactions: {
    data: ITransactionPaginatedResponse | null;
    isLoading: boolean;
    error: string | null;
  };
  maxBalance: number;
  filterCriteria: FilterCriteria;
  deleteConfirmOpen: boolean;
  selectedTransaction: IRelationalTransaction | null;
};
