import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { setViewBy } from '../../slices';
import { getAllPartnerAsyncThunk } from '../../slices/actions';
import { getAllAccountAsyncThunk } from '../../slices/actions/getAllAccountAsyncThunk';
import { getAllProductAsyncThunk } from '../../slices/actions/getAllProductAsyncThunk';
import { getFinanceByDateAsyncThunk } from '../../slices/actions/getFinanceByDateAsyncThunk';
import { ViewBy } from '../../slices/types';
import { chartComponents } from '../../utils';
import { FilterByViewType } from '../molecules';

const ChartFinancePage = () => {
  const viewBy = useAppSelector((state) => state.financeControl.viewBy);
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleViewByChange = (value: ViewBy) => {
    dispatch(setViewBy(value));
  };

  useEffect(() => {
    if (viewBy === 'date') {
      if (dateRange?.from && dateRange?.to) {
        // Nếu dateRange đã được chọn, sử dụng range đó
        dispatch(
          getFinanceByDateAsyncThunk({
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString(),
          }),
        );
      } else {
        // Mặc định lấy dữ liệu 10 năm gần nhất
        const now = new Date();
        const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()); // 10 năm trước từ ngày hiện tại

        dispatch(
          getFinanceByDateAsyncThunk({
            from: tenYearsAgo.toISOString(),
            to: now.toISOString(), // Đến ngày hiện tại
          }),
        );
      }
    } else if (viewBy === 'account') {
      dispatch(
        getAllAccountAsyncThunk({
          page: 1,
          pageSize: 50,
          search: '',
        }),
      );
    } else if (viewBy === 'product') {
      dispatch(
        getAllProductAsyncThunk({
          page: 1,
          pageSize: 50,
        }),
      );
    } else if (viewBy === 'partner') {
      dispatch(
        getAllPartnerAsyncThunk({
          page: 1,
          pageSize: 50,
        }),
      );
    }
  }, [dispatch, dateRange, viewBy]);

  const ChartComponent = chartComponents[viewBy];

  return (
    <div className="space-y-4 p-4">
      <FilterByViewType
        viewBy={viewBy}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onViewByChange={handleViewByChange}
      />

      <ChartComponent />
    </div>
  );
};

export default ChartFinancePage;
