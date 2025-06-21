interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabledDate?: (date: Date) => boolean;
  className?: string;
  error?: { message?: string };
  required?: boolean;
}

export interface DateRangeFromToPickerProps {
  from: DatePickerProps;
  to: DatePickerProps;
  className?: string;
  modeLabel?: 'row' | 'column';
  showLabels?: boolean;
}
