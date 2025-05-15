import DateRangePicker from '@/components/common/forms/date-range-picker/DateRangePicker';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  dateRange?: DateRange;
  onChange: (values: DateRange | undefined) => void;
  label?: string;
  colorScheme?: 'default' | 'accent' | 'secondary' | 'custom';
  customColor?: string;
  pastDaysLimit?: number;
  futureDaysLimit?: number;
  disablePast?: boolean;
  disableFuture?: boolean;
}

const DateRangeFilter = ({
  dateRange,
  onChange,
  label = 'Date Range',
  colorScheme = 'default',
  customColor,
  pastDaysLimit,
  futureDaysLimit,
  disablePast,
  disableFuture,
}: DateRangeFilterProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <Label>{label}</Label>
      <DateRangePicker
        date={dateRange}
        onChange={onChange}
        colorScheme={colorScheme}
        customColor={customColor}
        pastDaysLimit={pastDaysLimit}
        futureDaysLimit={futureDaysLimit}
        disablePast={disablePast}
        disableFuture={disableFuture}
      />
    </div>
  );
};

export default DateRangeFilter;
