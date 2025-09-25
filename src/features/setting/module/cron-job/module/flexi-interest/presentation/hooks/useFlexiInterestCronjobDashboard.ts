import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { formatObjUtil } from '../../utils/format-obj.util';
import { initialState, tableReducer } from '../reducers/table-reducer.reducer';
import { useLazyGetFlexiInterestQuery } from '../services/flexi-interest.service';
import { setLoading } from '../slices';
import { FlexiInterestCronjobTableData } from '../types/flexi-interest.type';

export const useFlexiInterestCronjobDashboard = () => {
  const dispatch = useAppDispatch();
  const { filter, loading } = useAppSelector((s) => s.flexiInterestCronjob);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const [triggerGetFlexiInterest] = useLazyGetFlexiInterestQuery();

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      // Table đang fetch data thì không fetch tiếp
      if (isFetching.current) return;
      isFetching.current = true;

      // Check đang tải thêm dữ liệu hay fetch lần đầu
      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }

      try {
        const localFilter = { ...filter };

        if (localFilter.fromDate) {
          const formatDate = new Date(localFilter.fromDate);
          formatDate.setHours(0, 0, 0, 0);
          localFilter.fromDate = formatDate.toISOString();
        }

        if (localFilter.toDate) {
          const formatDate = new Date(localFilter.toDate);
          formatDate.setHours(23, 59, 59, 99);
          localFilter.toDate = formatDate.toISOString();
        }

        const formattedFilter = formatObjUtil(localFilter);

        console.log(formattedFilter);

        // TODO: Call API lấy data
        const response = await triggerGetFlexiInterest({
          page,
          pageSize,
          ...formattedFilter,
        }).unwrap();

        const rows: FlexiInterestCronjobTableData[] = response?.items || [];

        // Nếu tải thêm data --> append
        // else lần đầu tải --> set data
        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: rows });

          console.log('>>> DATA STATE: ', state.data);
        } else {
          dispatchTable({ type: 'SET_DATA', payload: rows });
        }

        // TODO: cập nhật lại pagination cho table
        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: page,
            pageSize: pageSize,
            total: response?.total || 0,
          },
        });

        dispatchTable({
          type: 'SET_EXTRA_DATA',
          payload: {
            totalItems: response?.total || 0,
            totalSuccess: response?.totalSuccess || 0,
            totalFailed: response?.totalFailed || 0,
          },
        });

        // TODO: kiểm tra lại xem còn tải thêm được item không
        const hasMore = page * pageSize < (response?.total || 0);
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
      } finally {
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatch(setLoading(false));
        }

        // Cập nhật lại trạng thái fetching
        isFetching.current = false;
      }
    },
    [dispatch, filter],
  );

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;
    const next = state.pagination.current + 1;
    await fetchData(next, state.pagination.pageSize, true);
  }, [state.hasMore, state.isLoadingMore, state.pagination, fetchData]);

  const updateRowItem = useCallback((id: string, data: Partial<FlexiInterestCronjobTableData>) => {
    dispatchTable({ type: 'UPDATE_ITEM', payload: { id, data } });
  }, []);

  // Chạy fetch data lần đầu
  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  // Chạy khi change filter
  useEffect(() => {
    if (!isInitialLoad.current) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [fetchData, filter]);

  return {
    tableData: state,
    loading,
    loadMore,
    dispatchTable,
    updateRowItem,
  };
};
