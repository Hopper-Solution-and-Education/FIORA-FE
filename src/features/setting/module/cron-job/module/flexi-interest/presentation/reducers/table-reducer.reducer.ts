import { TableAction, TableState } from '../types/table-reducer.type';

const INITIAL_CURRENT_PAGE = 1;
const INITIAL_PAGE_SIZE = 20;
const INITIAL_TOTAL_PAGE = 0;

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
    case 'SET_EXTRA_DATA':
      return {
        ...state,
        extraData: {
          ...state.extraData,
          ...action.payload,
        },
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item,
        ),
      };
    default:
      return state;
  }
};

export const initialState: TableState = {
  data: [],
  pagination: {
    current: INITIAL_CURRENT_PAGE,
    pageSize: INITIAL_PAGE_SIZE,
    total: INITIAL_TOTAL_PAGE,
  },
  hasMore: true,
  isLoadingMore: false,
  extraData: {
    totalItems: 0,
    totalSuccess: 0,
    totalFailed: 0,
  },
};
