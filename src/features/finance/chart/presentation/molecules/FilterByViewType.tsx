import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { ViewBy } from '../../slices/types';
import { chartComponents, multiSelectConfig } from '../../utils';
import { DateRangePickerFinance, MultiSelectPickerFinance, ViewByCategorySelect } from '../atoms';

const FilterByViewType = ({
  viewBy,
  dateRange,
  setDateRange,
  onViewByChange,
}: {
  viewBy: ViewBy;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  onViewByChange: (value: ViewBy) => void;
}) => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">View By</span>
      <div className="w-32">
        <Select value={viewBy} onValueChange={(value) => onViewByChange(value as ViewBy)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(chartComponents).map((key) => (
              <SelectItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    {viewBy === 'date' && (
      <DateRangePickerFinance
        label="Select Date Range"
        dateRange={dateRange}
        onChange={setDateRange}
        labelPosition="horizontal"
      />
    )}
    {viewBy === 'category' && <ViewByCategorySelect />}
    {multiSelectConfig[viewBy] && (
      <MultiSelectPickerFinance label="" {...multiSelectConfig[viewBy]!} />
    )}
  </div>
);

export default FilterByViewType;
