import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { setViewBy } from '../../slices';
import { getAllPartnerAsyncThunk } from '../../slices/actions';
import { getAllAccountAsyncThunk } from '../../slices/actions/getAllAccountAsyncThunk';
import { getAllProductAsyncThunk } from '../../slices/actions/getAllProductAsyncThunk';
import { getFinanceByDateAsyncThunk } from '../../slices/actions/getFinanceByDateAsyncThunk';
import { ViewBy } from '../../slices/types';
import { chartComponents, tableComponents } from '../../utils';
import { FilterByViewType } from '../molecules';

const ChartFinancePage = () => {
  const viewBy = useAppSelector((state) => state.financeControl.viewBy);
  const viewMode = useAppSelector((state) => state.financeControl.viewMode);
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleViewByChange = (value: ViewBy) => {
    dispatch(setViewBy(value));
  };

  useEffect(() => {
    if (viewBy === 'date') {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const maxDate = today;

      const from = dateRange?.from ?? startOfYear;
      const to = dateRange?.to && dateRange.to < maxDate ? dateRange.to : maxDate;

      dispatch(
        getFinanceByDateAsyncThunk({
          from: from.toISOString(),
          to: to.toISOString(),
        }),
      );
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
  const TableComponent = tableComponents[viewBy];

  return (
    <div className="space-y-4 p-4">
      <FilterByViewType
        viewBy={viewBy}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onViewByChange={handleViewByChange}
      />

      {viewMode === 'chart' ? <ChartComponent /> : <TableComponent />}
    </div>
  );
};

export default ChartFinancePage;
