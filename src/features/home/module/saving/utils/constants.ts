import { FilterCriteria } from '@/shared/types';
import { SavingTableColumn } from '../types';

export const DEFAULT_SAVING_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

export const SAVING_COLUMNS: SavingTableColumn[] = [
  { col: 'No.', sortable: false },
  { col: 'Date', sortable: true },
  { col: 'Type', sortable: true },
  { col: 'Amount', sortable: true },
  { col: 'From', sortable: true },
  { col: 'To', sortable: true },
  { col: 'Remark', sortable: true },
  { col: 'Actions', sortable: false },
];
