import { FlexiInterestCronjobTableData } from './flexi-interest.type';

export interface TableState {
  data: FlexiInterestCronjobTableData[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  hasMore: boolean;
  isLoadingMore: boolean;
  extraData: {
    currentItemCount: number;
    totalItems: number;
    totalSuccess: number;
    totalFailed: number;
  };
}

export type TableAction =
  | { type: 'SET_DATA'; payload: FlexiInterestCronjobTableData[] }
  | { type: 'APPEND_DATA'; payload: FlexiInterestCronjobTableData[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean }
  | {
      type: 'SET_EXTRA_DATA';
      payload: {
        currentItemCount: number;
        totalItems: number;
        totalSuccess: number;
        totalFailed: number;
      };
    }
  | { type: 'UPDATE_ITEM'; payload: { id: string; data: Partial<FlexiInterestCronjobTableData> } };
