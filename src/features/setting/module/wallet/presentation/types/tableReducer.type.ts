import { WALLET_SETTING_CONSTANTS } from '../../data/constant';
import { DepositRequestStatus } from '../../domain';
import { WalletSettingTableData } from './index';

export interface TableState {
  data: WalletSettingTableData[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status: DepositRequestStatus | 'all';
    search: string;
  };
  selectedItem: WalletSettingTableData | null;
  showForm: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export type TableAction =
  | { type: 'SET_DATA'; payload: WalletSettingTableData[] }
  | { type: 'APPEND_DATA'; payload: WalletSettingTableData[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_STATUS'; payload: DepositRequestStatus | 'all' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SELECTED_ITEM'; payload: WalletSettingTableData | null }
  | { type: 'SET_SHOW_FORM'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean }
  | {
      type: 'UPDATE_ITEM_STATUS';
      payload: { id: string; status: DepositRequestStatus; remark?: string };
    };

// Reducer function
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

    case 'UPDATE_ITEM_STATUS':
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status, remark: action.payload.remark }
            : item,
        ),
        showForm: false,
        selectedItem: null,
      };

    default:
      return state;
  }
};

export const initialState: TableState = {
  data: [],
  pagination: {
    current: WALLET_SETTING_CONSTANTS.DEFAULT_PAGE,
    pageSize: WALLET_SETTING_CONSTANTS.PAGE_SIZE,
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
};
