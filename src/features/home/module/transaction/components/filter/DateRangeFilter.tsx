import DateRangePicker from '@/components/common/forms/date-range-picker/DateRangePicker';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  dateRange?: DateRange;
  onChange: (values: DateRange | undefined) => void;
}

const DateRangeFilter = ({ dateRange, onChange }: DateRangeFilterProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <Label>Date</Label>
      <DateRangePicker date={dateRange} onChange={onChange} colorScheme="default" />
    </div>
  );
};

export default DateRangeFilter;
