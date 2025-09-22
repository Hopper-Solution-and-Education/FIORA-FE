export interface TableState {
  items: any[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const initialState: TableState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
};

export type TableAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'SET_DATA';
      payload: { items: any[]; total: number; page: number; pageSize: number; totalPages: number };
    }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET' };

export const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
