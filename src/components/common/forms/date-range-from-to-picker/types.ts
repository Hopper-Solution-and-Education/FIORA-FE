export type DateRangeFromToPickerProps = {
  from: {
    label?: string;
    data: Date;
    setFrom: (date: Date | undefined) => void;
    placeholder?: string;
    disabledDate?: (date: Date) => boolean;
    className?: string;
    error?: string;
  };
  to: {
    label?: string;
    data: Date;
    setTo: (date: Date | undefined) => void;
    placeholder?: string;
    disabledDate?: (date: Date) => boolean;
    className?: string;
    error?: string;
  };
  className?: string;
  modeLabel?: 'row' | 'column';
  showLabels?: boolean;
};
