import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { setViewBy } from '../../slices';
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
    if (viewBy === 'date' && dateRange?.from && dateRange?.to) {
      dispatch(
        getFinanceByDateAsyncThunk({
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
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
