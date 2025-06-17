import { FieldError } from 'react-hook-form';

export type DateRangeFromToPickerProps = {
  from: {
    name?: string;
    label?: string;
    value: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabledDate?: (date: Date) => boolean;
    className?: string;
    error?: FieldError;
    onBlur?: () => void;
    required?: boolean;
  };
  to: {
    name?: string;
    label?: string;
    value: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabledDate?: (date: Date) => boolean;
    className?: string;
    error?: FieldError;
    onBlur?: string;
    required?: boolean;
  };
  className?: string;
  modeLabel?: 'row' | 'column';
  showLabels?: boolean;
};
