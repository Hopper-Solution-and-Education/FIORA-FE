import { FilterCriteria } from '@/shared/types';
import { SavingTableColumnKey } from '../types';

export const DEFAULT_SAVING_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
  search: '',
  sortBy: {
    date: 'desc',
  },
};

export const DEFAULT_SAVING_AMOUNT_RANGE = {
  min: 0,
  max: 15000,
};

export const DEFAULT_SAVING_TRANSACTION_TABLE_COLUMNS: SavingTableColumnKey = {
  //True = sortable, False = not sortable
  'No.': { sortable: false, index: 1, sortedBy: 'none' },
  Date: { sortable: true, index: 2, sortedBy: 'none' },
  Type: { sortable: true, index: 3, sortedBy: 'none' },
  Amount: { sortable: true, index: 4, sortedBy: 'none' },
  From: { sortable: true, index: 5, sortedBy: 'none' },
  To: { sortable: true, index: 6, sortedBy: 'none' },
  Remark: { sortable: true, index: 7, sortedBy: 'none' },
  Actions: { sortable: false, index: 8, sortedBy: 'none' },
};
