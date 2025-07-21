import { NotificationDashboardTableData } from './setting.type';

export interface TableState {
  data: NotificationDashboardTableData[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status: string | 'all';
    search: string;
  };
  selectedItem: NotificationDashboardTableData | null;
  showForm: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  showDetailModal: boolean;
  detailId: string | null;
}

export type TableAction =
  | { type: 'SET_DATA'; payload: NotificationDashboardTableData[] }
  | { type: 'APPEND_DATA'; payload: NotificationDashboardTableData[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_STATUS'; payload: string | 'all' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SELECTED_ITEM'; payload: NotificationDashboardTableData | null }
  | { type: 'SET_SHOW_FORM'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean }
  | { type: 'TOGGLE_DETAIL_MODAL'; payload: { open: boolean; id?: string | null } };

export const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'APPEND_DATA':
      return { ...state, data: [...state.data, ...action.payload] };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SET_STATUS':
      return { ...state, filters: { ...state.filters, status: action.payload } };
    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, current: action.payload } };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'SET_SHOW_FORM':
      return { ...state, showForm: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_IS_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };
    case 'TOGGLE_DETAIL_MODAL':
      return {
        ...state,
        showDetailModal: action.payload.open,
        detailId: action.payload.open ? (action.payload.id ?? null) : null,
      };
    default:
      return state;
  }
};

export const initialState: TableState = {
  data: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    status: 'all',
    search: '',
  },
  selectedItem: null,
  showForm: false,
  hasMore: true,
  isLoadingMore: false,
  showDetailModal: false,
  detailId: null,
};
