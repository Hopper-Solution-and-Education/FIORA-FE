import DateRangePicker from '@/components/common/forms/date-range-picker/DateRangePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { ChartByAccount, ChartByCategory, ChartByDate } from '../organisms';
import { useAppDispatch } from '@/store';
import { getFinanceByDateAsyncThunk } from '../../slices/actions/getFinanceByDateAsyncThunk';

type ViewBy = 'date' | 'category' | 'account';

const ChartFinancePage = () => {
  const [viewBy, setViewBy] = useState<ViewBy>('date');
  const [viewByCategory, setViewByCategory] = useState<'income' | 'expense'>('income');

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getFinanceByDateAsyncThunk({
        from: dateRange?.from ? dateRange.from.toISOString() : '',
        to: dateRange?.to ? dateRange.to.toISOString() : '',
      }),
    );
  }, [dispatch, dateRange]);

  const renderViewByCategorySelect = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">Sort By</div>
        <div className="w-32">
          <Select
            value={viewByCategory}
            onValueChange={(value) => setViewByCategory(value as 'income' | 'expense')}
            defaultValue="income"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">View By</div>
          <div className="w-32">
            <Select
              value={viewBy}
              onValueChange={(value) => setViewBy(value as ViewBy)}
              defaultValue="date"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {viewBy === 'date' && (
          <div>
            <DateRangePicker
              date={dateRange}
              onChange={(value: DateRange | undefined) => setDateRange(value)}
            />
          </div>
        )}
        {viewBy === 'category' && renderViewByCategorySelect()}
      </div>
      {viewBy === 'date' && <ChartByDate />}
      {viewBy === 'category' && <ChartByCategory viewBy={viewByCategory} />}
      {viewBy === 'account' && <ChartByAccount />}
    </div>
  );
};

export default ChartFinancePage;
