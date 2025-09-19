import { ReferralCronjobTableData } from './referral.type';

export interface TableState {
  items: ReferralCronjobTableData[];
  loading: boolean;
  paginationLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export type TableAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PAGINATION_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_DATA';
      payload: {
        items: ReferralCronjobTableData[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number };

export const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PAGINATION_LOADING':
      return { ...state, paginationLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DATA':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        currentPage: action.payload.page,
        pageSize: action.payload.pageSize,
        totalPages: action.payload.totalPages,
        loading: false,
        paginationLoading: false, // Reset pagination loading
        error: null,
      };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, currentPage: 1 };
    default:
      return state;
  }
};

export const initialState: TableState = {
  items: [],
  loading: false,
  paginationLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  total: 0,
};
