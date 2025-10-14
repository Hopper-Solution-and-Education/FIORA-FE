import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { setLoading } from '../../slices';
import { FilterState, User } from '../../slices/type';
import { useGetCountUsersQuery, UserApiResponse, usersApi } from '../../store/api/userApi';
import { initialState, tableReducer } from '../reducers/table-reducer.reducer';

export function useUserManagement() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.userManagement);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const [triggerGetUsers] = usersApi.useLazyGetUsersQuery();
  const [triggerGetCountUsers] = usersApi.useLazyGetCountUsersQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    roles: [],
    status: [],
    fromDate: null,
    toDate: null,
    emails: [],
    userFromDate: null,
    userToDate: null,
  });

  const [shouldRefetch, setShouldRefetch] = useState(false);

  const selectedDateRange: DateRange | undefined = useMemo(() => {
    if (appliedFilters.fromDate || appliedFilters.toDate) {
      return {
        from: appliedFilters.fromDate || undefined,
        to: appliedFilters.toDate || undefined,
      };
    }
    return undefined;
  }, [appliedFilters.fromDate, appliedFilters.toDate]);

  const queryParams = useMemo(() => {
    const params: any = {
      page: state.pagination.page,
      pageSize: state.pagination.pageSize,
    };

    if (appliedFilters.roles && appliedFilters.roles.length > 0) {
      params.roles = appliedFilters.roles;
    }

    // Add status filters (exclude 'all' option)
    if (appliedFilters.status && appliedFilters.status.length > 0) {
      const filteredStatus = appliedFilters.status.filter((status) => status !== 'all');
      if (filteredStatus.length > 0) {
        params.status = filteredStatus;
      }
    }

    // Add userIds filter (emails array contains user IDs)
    if (appliedFilters.emails && appliedFilters.emails.length > 0) {
      params.emails = appliedFilters.emails;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // Format KYC date range to ISO strings
    if (appliedFilters.fromDate) {
      const fromDate = new Date(appliedFilters.fromDate);
      fromDate.setHours(0, 0, 0, 0);
      params.fromDate = fromDate.toISOString().split('T')[0];
    }

    if (appliedFilters.toDate) {
      const toDate = new Date(appliedFilters.toDate);
      toDate.setHours(23, 59, 59, 999);
      params.toDate = toDate.toISOString().split('T')[0];
    }

    // Format User Registration date range to ISO strings
    if (appliedFilters.userFromDate) {
      const userFromDate = new Date(appliedFilters.userFromDate);
      userFromDate.setHours(0, 0, 0, 0);
      params.userFromDate = userFromDate.toISOString().split('T')[0];
    }

    if (appliedFilters.userToDate) {
      const userToDate = new Date(appliedFilters.userToDate);
      userToDate.setHours(23, 59, 59, 999);
      params.userToDate = userToDate.toISOString().split('T')[0];
    }

    return params;
  }, [appliedFilters, searchQuery, state.pagination]);

  const { data: pendingCount } = useGetCountUsersQuery({ eKycStatus: 'PENDING' });

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore: boolean) => {
      if (isFetching.current) return;
      isFetching.current = true;

      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }

      try {
        // const localFilter = { ...filters };

        const filterParams = { ...queryParams };
        delete filterParams.page;
        delete filterParams.pageSize;

        const totalCountParams = {
          ...queryParams,
          // ...localFilter,
        };

        // Use filterParams for count query
        const totalCount = await triggerGetCountUsers(filterParams).unwrap();

        // Use filterParams for get users query
        const response = await triggerGetUsers({
          page,
          pageSize,
          ...filterParams,
          // ...localFilter,
        }).unwrap();

        const rows: UserApiResponse[] = response?.data || [];

        const transformedRows: User[] = rows.map(
          (user: UserApiResponse): User => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.isBlocked ? 'blocked' : 'active',
            registrationDate: new Date(user.createdAt).toLocaleDateString('en-GB'),
            avatarUrl: user.avatarId ? `/api/avatar/${user.avatarId}` : null,
            eKYC: user.eKYC || [],
          }),
        );

        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: transformedRows });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: transformedRows });
        }

        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            page: page,
            pageSize,
            total: totalCount,
          },
        });

        const hasMore = page * pageSize < totalCount;
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatch(setLoading(false));
        }
        isFetching.current = false;
      }
    },
    [dispatch, queryParams, triggerGetUsers, triggerGetCountUsers],
  );

  // Add loadMore function (called by table on scroll)
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;
    const next = state.pagination.page + 1;
    await fetchData(next, state.pagination.pageSize, true);
  }, [state.hasMore, state.isLoadingMore, state.pagination, fetchData]);

  // Update filteredUsers to use reducer state (accumulated data)
  const filteredUsers: User[] = useMemo(() => {
    return state.data;
  }, [state.data]);

  const setSearchQueryWithRefetch = useCallback((value: string) => {
    if (value === '') {
      setSearchQuery('');
      setShouldRefetch(true);
      return;
    }
    if (value.trim() === '') {
      return;
    }
    
    const trimmedValue = value.trim();
    // Don't trigger search if the value is only spaces or empty
    if (trimmedValue === '') {
      setSearchQuery(value); // Keep the UI value but don't refetch
      return;
    }

    setSearchQuery(value);
    setShouldRefetch(true);
  }, []);

  const setFilters = useCallback((filters: FilterState) => {
    setAppliedFilters(filters);
    // Reset pagination and data on filter change
    dispatchTable({ type: 'SET_PAGE', payload: 1 });
    dispatchTable({ type: 'SET_DATA', payload: [] });
    dispatchTable({ type: 'SET_HAS_MORE', payload: true });
    setShouldRefetch(true);
  }, []);

  const clearFilters = useCallback(() => {
    const resetFilters: FilterState = {
      roles: [],
      status: [],
      fromDate: null,
      toDate: null,
      emails: [],
      userFromDate: null,
      userToDate: null,
    };
    setAppliedFilters(resetFilters);
    setSearchQuery('');
    // Reset pagination and data
    dispatchTable({ type: 'SET_PAGE', payload: 1 });
    dispatchTable({ type: 'SET_DATA', payload: [] });
    dispatchTable({ type: 'SET_HAS_MORE', payload: true });
    setShouldRefetch(true);
  }, []);

  // Effect for initial load
  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  // Effect for filter/search changes (triggers refetch)
  useEffect(() => {
    if (!isInitialLoad.current && shouldRefetch) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
      setShouldRefetch(false);
    }
  }, [fetchData, shouldRefetch]);

  // Update serverTotal to use reducer
  const serverTotal = state.pagination.total;

  // Update stats to use reducer data
  const stats = useMemo(() => {
    const rawUsers = state.data; // Use accumulated data
    const totalActive = rawUsers.filter((u) => u.status === 'active').length;
    const totalBlocked = rawUsers.filter((u) => u.status === 'blocked').length;
    return { totalActive, totalBlocked };
  }, [state.data]);

  return {
    // Search & Filters
    searchQuery,
    setSearchQuery: setSearchQueryWithRefetch,
    appliedFilters,
    selectedDateRange,
    setFilters,
    clearFilters,

    // Data
    filteredUsers,
    stats,

    // Loading states
    isLoading: loading,
    error: null,

    // Pagination
    page: state.pagination.page,
    setPage: (page: number) => dispatchTable({ type: 'SET_PAGE', payload: page }),
    hasMore: state.hasMore,
    loadMore,
    isLoadingMore: state.isLoadingMore,
    total: serverTotal,
    pendingTotal: pendingCount ?? 0,
    displayedTotal: filteredUsers.length,

    tableData: state,
  };
}
