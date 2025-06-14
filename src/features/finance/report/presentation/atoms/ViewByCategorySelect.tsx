import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store';
import { memo } from 'react';
import { setViewChartByCategory } from '../../slices';
import { ViewChartByCategory } from '../../slices/types';

const ViewByCategorySelect = () => {
  const viewChartByCategory = useAppSelector((state) => state.financeControl.viewChartByCategory);
  const dispatch = useAppDispatch();
  const handleViewChartByCategoryChange = (value: ViewChartByCategory) => {
    dispatch(setViewChartByCategory(value));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium">Sort By</div>
      <div className="w-32">
        <Select
          value={viewChartByCategory}
          onValueChange={(value) => handleViewChartByCategoryChange(value as ViewChartByCategory)}
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

export default memo(ViewByCategorySelect);
