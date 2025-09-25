import { MembershipCronjobTableData } from './membership.type';

type Option = { value: string; label: string };

export interface TableState {
  data: MembershipCronjobTableData[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  hasMore: boolean;
  isLoadingMore: boolean;
  // Shared option states for filter menus (kept here to persist across mounts)
  tierOptions?: Option[];
  emailOptions?: Option[];
  updatedByOptions?: Option[];
  // Option loading/pagination states (optional, for infinite scrolling)
  tierPage?: number;
  tierHasMore?: boolean;
  tierLoadingMore?: boolean;
  userPage?: number;
  userHasMore?: boolean;
  userLoadingMore?: boolean;
}

export type TableAction =
  | { type: 'SET_DATA'; payload: MembershipCronjobTableData[] }
  | { type: 'APPEND_DATA'; payload: MembershipCronjobTableData[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_IS_LOADING_MORE'; payload: boolean }
  | { type: 'UPDATE_ROW'; payload: { id: string; updates: Partial<MembershipCronjobTableData> } }
  // Option actions
  | { type: 'SET_TIER_OPTIONS'; payload: Option[] }
  | { type: 'APPEND_TIER_OPTIONS'; payload: Option[] }
  | { type: 'SET_EMAIL_OPTIONS'; payload: Option[] }
  | { type: 'APPEND_EMAIL_OPTIONS'; payload: Option[] }
  | { type: 'SET_UPDATED_BY_OPTIONS'; payload: Option[] }
  | { type: 'APPEND_UPDATED_BY_OPTIONS'; payload: Option[] }
  | {
      type: 'SET_TIER_OPTION_STATE';
      payload: { page?: number; hasMore?: boolean; loadingMore?: boolean };
    }
  | {
      type: 'SET_USER_OPTION_STATE';
      payload: { page?: number; hasMore?: boolean; loadingMore?: boolean };
    };

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
    case 'SET_TIER_OPTIONS':
      return { ...state, tierOptions: action.payload };
    case 'APPEND_TIER_OPTIONS':
      return { ...state, tierOptions: [...(state.tierOptions || []), ...action.payload] };
    case 'SET_EMAIL_OPTIONS':
      return { ...state, emailOptions: action.payload };
    case 'APPEND_EMAIL_OPTIONS':
      return { ...state, emailOptions: [...(state.emailOptions || []), ...action.payload] };
    case 'SET_UPDATED_BY_OPTIONS':
      return { ...state, updatedByOptions: action.payload };
    case 'APPEND_UPDATED_BY_OPTIONS':
      return {
        ...state,
        updatedByOptions: [...(state.updatedByOptions || []), ...action.payload],
      };
    case 'SET_TIER_OPTION_STATE':
      return {
        ...state,
        tierPage: action.payload.page ?? state.tierPage,
        tierHasMore: action.payload.hasMore ?? state.tierHasMore,
        tierLoadingMore: action.payload.loadingMore ?? state.tierLoadingMore,
      };
    case 'SET_USER_OPTION_STATE':
      return {
        ...state,
        userPage: action.payload.page ?? state.userPage,
        userHasMore: action.payload.hasMore ?? state.userHasMore,
        userLoadingMore: action.payload.loadingMore ?? state.userLoadingMore,
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
  tierOptions: [],
  emailOptions: [],
  updatedByOptions: [],
  tierPage: 1,
  tierHasMore: true,
  tierLoadingMore: false,
  userPage: 1,
  userHasMore: true,
  userLoadingMore: false,
};
