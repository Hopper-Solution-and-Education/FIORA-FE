import { ISavingTransactionFilter } from '../../../types';

export interface CreateSavingHistoryRequest extends ISavingTransactionFilter {
  searchParams?: string;
}
