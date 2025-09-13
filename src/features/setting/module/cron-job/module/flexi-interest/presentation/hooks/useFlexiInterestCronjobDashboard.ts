import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { initialState, tableReducer } from '../reducers/table-reducer.reducer';
import { setLoading } from '../slices';
import { FlexiInterestCronjobTableData } from '../types/flexi-interest.type';

const mockData: FlexiInterestCronjobTableData[] = [
  {
    id: '000001',
    email: 'userA@gmail.com',
    executionTime: '2025-06-24T22:06:19Z',
    tier: 'Platinum Qiii',
    rate: 15,
    activeBalance: 100000.0,
    amount: 0.0,
    status: 'fail',
    updateBy: 'System',
    reason: 'None',
  },
  {
    id: '000002',
    email: 'userB@gmail.com',
    executionTime: '2025-06-24T22:06:19Z',
    tier: 'Diamond Dragon',
    rate: 20,
    activeBalance: 150000.0,
    amount: 10.0,
    status: 'successful',
    updateBy: 'System',
    reason: 'None',
  },
  {
    id: '000003',
    email: 'userC@gmail.com',
    executionTime: '2025-06-24T22:06:19Z',
    tier: 'Titan Phoenix',
    rate: 5,
    activeBalance: 100000.0,
    amount: 5000.0,
    status: 'successful',
    updateBy: 'System',
    reason: 'None',
  },
  {
    id: '000004',
    email: 'userD@gmail.com',
    executionTime: '2025-06-24T22:06:19Z',
    tier: 'Silver Egg',
    rate: 2,
    activeBalance: 15000.0,
    amount: 300.0,
    status: 'successful',
    updateBy: 'System',
    reason: 'None',
  },
  {
    id: '000005',
    email: 'userE@gmail.com',
    executionTime: '2025-06-24T22:06:19Z',
    tier: 'Titan Phoenix',
    rate: 5,
    activeBalance: 100000.0,
    amount: 0.0,
    status: 'fail',
    updateBy: 'System',
    reason: 'None',
  },
  {
    id: '000006',
    email: 'userF@gmail.com',
    executionTime: '2025-06-24T22:06:19Z',
    tier: 'Gold Tortoise',
    rate: 8,
    activeBalance: 0.0,
    amount: 0.0,
    status: 'fail',
    updateBy: 'System',
    reason: 'None',
  },
];

export const useFlexiInterestCronjobDashboard = () => {
  const dispatch = useAppDispatch();
  const { filter, loading } = useAppSelector((s) => s.flexiInterestCronjob);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      // Table đang fetch data thì không fetch tiếp
      if (isFetching.current) return;

      // Check đang tải thêm dữ liệu hay fetch lần đầu
      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }

      try {
        // TODO: Call API lấy data

        // MOCK DATA
        const rows: FlexiInterestCronjobTableData[] = mockData;

        // Nếu tải thêm data --> append
        // else lần đầu tải --> set data
        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: rows });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: rows });
        }

        // TODO: cập nhật lại pagination cho table
        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: 1,
            pageSize: 20,
            total: 0,
          },
        });

        // TODO: kiểm tra lại xem còn tải thêm được item không
        const hasMore = false;
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
  };
};
