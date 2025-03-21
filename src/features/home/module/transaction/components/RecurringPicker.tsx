import { DatePicker } from '@/components/ui/date-picker-v1';
import { TransactionRecurringType } from '../types/constants';

type RecurringPickerProps = {
  recurringType: TransactionRecurringType;
  defaultValue: Date;
  onChange: (value: Date | undefined) => void;
};
const RecurringPicker = (props: RecurringPickerProps) => {
  const { recurringType, defaultValue, onChange } = props;

  switch (recurringType) {
    case TransactionRecurringType.DAILY:
      return (
        <DatePicker
          toDate={new Date()}
          value={defaultValue}
          disabled
          onChange={(date) => onChange(date)}
          className="w-full"
        />
      );
  }
};

export default RecurringPicker;
