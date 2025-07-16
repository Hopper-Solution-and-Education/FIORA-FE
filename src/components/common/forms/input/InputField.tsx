'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Input } from '@/components/ui/input';
import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';

interface InputFieldProps {
  value?: string;
  name?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  options?: {
    percent?: boolean; // Enable percentage input
    maxPercent?: number; // Optional: Max percentage (default 100)
    decimal?: boolean; // Enable decimal input
    maxDecimal?: number; // Optional: Max decimal places
  };
  maxLength?: number;
  [key: string]: any;
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder,
  id,
  required,
  options = {},
  maxLength,
  ...props
}) => {
  const { percent = false, maxPercent = 100 } = options;

  // Handle input changes (allow leading zeros and commas during typing)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.split(',').join('');

    if (percent) {
      // Allow numbers, decimal point, and comma
      inputValue = inputValue.replace(/[^0-9.,]/g, '');

      // Ensure only one decimal point or comma
      const parts = inputValue.split(/[.,]/);
      if (parts.length > 2) {
        inputValue = `${parts[0]}.${parts[1]}`;
      }
    }

    onChange(inputValue);
  };

  // Format value on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let formattedValue = value;

    if (percent && formattedValue !== '') {
      // Replace comma with period for consistency
      formattedValue = formattedValue.replace(',', '.');

      // Split into integer and decimal parts
      const parts = formattedValue.split('.');
      let integerPart = parts[0] || '';
      const decimalPart = parts[1] || '';

      // Remove leading zeros from integer part
      if (integerPart) {
        integerPart = parseInt(integerPart, 10).toString();
        if (integerPart === '0' && !decimalPart) {
          integerPart = '0'; // Keep "0" for integer-only input
        }
      }

      // Format decimal part (trim trailing zeros)
      const formattedDecimal = decimalPart.replace(/0+$/, '');

      // Reconstruct the value
      if (decimalPart) {
        formattedValue =
          integerPart === '0' ? `0.${formattedDecimal}` : `${integerPart}.${formattedDecimal}`;
      } else {
        formattedValue = integerPart || '0';
      }

      // Convert to number and validate range
      const numValue = parseFloat(formattedValue);
      if (!isNaN(numValue)) {
        if (numValue < 0) formattedValue = '0';
        if (numValue > maxPercent) formattedValue = maxPercent.toString();
      } else {
        formattedValue = '0'; // Fallback for invalid input
      }

      // Remove decimal part if it's an integer
      if (Number.isInteger(parseFloat(formattedValue))) {
        formattedValue = parseInt(formattedValue, 10).toString();
      }
    }

    onChange(formattedValue);
    onBlur?.(e);
  };

  return (
    <div className="mb-4">
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} htmlFor={id} required={required} />
        ) : (
          label
        ))}
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          id={id}
          type={percent ? 'text' : props.type || 'text'}
          maxLength={maxLength}
          className={`pr-8 text-xs md:text-sm ${error ? 'border-red-500' : ''}`}
          data-test={props['data-test'] || (props.name ? `${props.name}-input` : undefined)}
          {...props}
        />
        {percent && (
          <span
            className={`
              absolute inset-y-0 right-2 flex items-center text-gray-500
              text-xs md:text-sm
            `}
          >
            %
          </span>
        )}
      </div>
      {error && (
        <p
          className={`
            mt-1 text-xs text-red-500
            md:text-sm
          `}
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

export default memo(InputField);
