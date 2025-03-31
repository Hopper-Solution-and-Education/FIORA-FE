'use client';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';

interface DateTimePickerProps {
  name: string; // Add this
  label?: string; // Add this
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  className?: string;
  placeholder?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  error?: any; // Add this for form validation errors
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  dropdownMode?: 'select' | 'scroll';
  minDate?: Date;
  maxDate?: Date;
}

const CustomDateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      className,
      placeholder = 'Pick a date',
      showTimeSelect = false,
      dateFormat = 'dd/MM/yyyy',
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </div>
        )}
        <ReactDatePicker
          name={name}
          selected={value}
          onChange={onChange}
          showTimeSelect={showTimeSelect}
          dateFormat={dateFormat}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText={placeholder}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500',
          )}
          customInput={
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? value.toLocaleDateString() : placeholder}
            </Button>
          }
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    );
  },
);

CustomDateTimePicker.displayName = 'CustomDateTimePicker';

export default CustomDateTimePicker;
