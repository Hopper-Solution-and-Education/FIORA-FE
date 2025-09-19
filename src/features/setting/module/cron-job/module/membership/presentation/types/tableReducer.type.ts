import { MembershipCronjobTableData } from './membership.type';

export interface TableState {
  data: MembershipCronjobTableData[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  hasMore: boolean;
  isLoadingMore: boolean;
}

export type TableAction =
  | { type: 'SET_DATA'; payload: MembershipCronjobTableData[] }
  | { type: 'APPEND_DATA'; payload: MembershipCronjobTableData[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean }
  | { type: 'UPDATE_ROW'; payload: { id: string; updates: Partial<MembershipCronjobTableData> } };

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
    case 'UPDATE_ROW':
      return {
        ...state,
        data: state.data.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r,
        ),
      };
    default:
      return state;
  }
};

export const initialState: TableState = {
  data: [],
  pagination: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
  hasMore: true,
  isLoadingMore: false,
};
