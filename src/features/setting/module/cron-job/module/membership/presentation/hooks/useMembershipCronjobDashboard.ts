import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { MembershipCronjobItem } from '../../data/dto/response/MembershipCronjobResponse';
import { MembershipCronjobMapper } from '../../data/mapper';
import { membershipCronjobContainer } from '../../di/membershipCronjobDashboardDI';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IGetMembershipCronjobsPaginatedUseCase } from '../../domain/usecase/GetMembershipCronjobsPaginatedUseCase';
import { setLoading, setStatistics } from '../../slices';
import { initialState, tableReducer } from '../types/tableReducer.type';

export const useMembershipCronjobDashboard = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((s) => s.membershipCronjob);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      if (isFetching.current) return;
      isFetching.current = true;
      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }

      try {
        const useCase = membershipCronjobContainer.get<IGetMembershipCronjobsPaginatedUseCase>(
          MEMBERSHIP_CRONJOB_TYPES.IGetMembershipCronjobsPaginatedUseCase,
        );

        const res = await useCase.execute(page, pageSize, {
          status: filter?.status || [],
          search: filter?.search || '',
          fromDate: filter?.fromDate || '',
          toDate: filter?.toDate || '',
        });

        const list = MembershipCronjobMapper.toList(res);

        const rows = (list.data || []).map((it: MembershipCronjobItem) => {
          const dynamicKeys = Object.keys(it.dynamicValue || {});
          const firstKey = dynamicKeys[0];
          const secondKey = dynamicKeys[1];

          const fromTier =
            (firstKey ? it.dynamicValue?.[firstKey] : undefined) ||
            it.updatedBy?.MembershipProgress?.[0]?.tier?.tierName ||
            'N/A';
          const toTier =
            (secondKey ? it.dynamicValue?.[secondKey] : undefined) ||
            it.updatedBy?.MembershipProgress?.[0]?.tier?.tierName ||
            'N/A';

          return {
            id: it.id,
            email: it.updatedBy?.email || 'N/A',
            executionTime: it.executionTime,
            fromTier,
            spent: it.spent || it.updatedBy?.MembershipProgress?.[0]?.currentSpent || '0',
            balance: it.balance || it.updatedBy?.MembershipProgress?.[0]?.currentBalance || '0',
            toTier,
            status: it.status,
            updatedBy: {
              id: it.updatedBy?.id || '',
              email: it.updatedBy?.email || 'N/A',
            },
            transactionId: it.transactionId,
          };
        });

        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: rows });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: rows });
        }

        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: list.page,
            pageSize: list.pageSize,
            total: list.total ?? 0,
          },
        });

        const hasMore =
          list.page < (list.totalPage ?? Math.ceil((list.total ?? 0) / list.pageSize));
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
        dispatch(setStatistics(list.statistics));
      } finally {
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatch(setLoading(false));
        }
        isFetching.current = false;
      }
    },
    [dispatch, filter],
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [filter, fetchData]);

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;
    const next = state.pagination.current + 1;
    await fetchData(next, state.pagination.pageSize, true);
  }, [state.hasMore, state.isLoadingMore, state.pagination, fetchData]);

  return {
    tableData: state,
    loading: useAppSelector((s) => s.membershipCronjob.loading),
    loadMore,
    dispatchTable,
  };
};
