export interface TableState {
  data: any[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  hasMore: boolean;
  isLoadingMore: boolean;
  statistics: {
    totalSuccess: number;
    totalFailed: number;
  };
}

export const initialState: TableState = {
  data: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  hasMore: true,
  isLoadingMore: false,
  statistics: {
    totalSuccess: 0,
    totalFailed: 0,
  },
};

export type TableAction =
  | { type: 'SET_DATA'; payload: any[] }
  | { type: 'APPEND_DATA'; payload: any[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean }
  | { type: 'SET_STATISTICS'; payload: { totalSuccess: number; totalFailed: number } };

export const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'APPEND_DATA':
      return { ...state, data: [...state.data, ...action.payload] };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, current: action.payload } };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_IS_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    default:
      return state;
  }
};
