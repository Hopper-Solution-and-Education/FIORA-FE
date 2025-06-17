import DatePicker from '@/components/modern-ui/date-picker';

type DateRangeFromToPickerProps = {
  from: Date;
  to: Date;
  setFrom: (date: Date | undefined) => void;
  setTo: (date: Date | undefined) => void;
};

const DateRangeFromToPicker = ({ from, to, setFrom, setTo }: DateRangeFromToPickerProps) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-row gap-2 w-1/2 items-center">
        <label htmlFor="from" className="text-sm font-medium">
          From
        </label>
        <DatePicker date={from} setDate={setFrom} />
      </div>
      <div className="flex flex-row gap-2 w-1/2 items-center">
        <label htmlFor="to" className="text-sm font-medium">
          To
        </label>
        <DatePicker date={to} setDate={setTo} disabledDate={(date) => date < from} />
      </div>
    </div>
  );
};

export default DateRangeFromToPicker;
