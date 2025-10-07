import { User } from '../../slices/type';

interface TableState {
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  hasMore: boolean;
  isLoadingMore: boolean;
  extraData?: any;
}

export const initialState: TableState = {
  data: [],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
  hasMore: true,
  isLoadingMore: false,
  extraData: null,
};

type TableAction =
  | { type: 'SET_DATA'; payload: User[] }
  | { type: 'APPEND_DATA'; payload: User[] }
  | { type: 'SET_PAGINATION'; payload: { page: number; pageSize: number; total: number } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean };

export const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'APPEND_DATA':
      const newData = [...state.data, ...action.payload];
      return { ...state, data: newData };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, page: action.payload } };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_IS_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };
    default:
      return state;
  }
};
