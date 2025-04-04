import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { FieldError } from 'react-hook-form';

interface InputCurrencyProps {
  value?: number;
  name?: string;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  currency: string;
  [key: string]: any;
}

/**
 * Formats a number into a currency string based on the currency code.
 * @param value - The numeric value to format
 * @param currency - The currency code (e.g., 'USD', 'VND')
 * @returns Formatted currency string or empty string if invalid
 */
const formatCurrency = (value: number, currency: string): string => {
  if (typeof value !== 'number' || isNaN(value)) return '';
  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    // For VND, typically no decimals; for USD, 2 decimals
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value);
};

const InputCurrency: React.FC<InputCurrencyProps> = ({
  value = 0,
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder,
  id,
  required,
  currency,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value ? value.toString() : '');

  // Sync local value with form value when not focused
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value ? formatCurrency(value, currency) : '');
    }
  }, [value, currency, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show unformatted number for editing
    setLocalValue(value ? value.toString() : '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update local value as the user types
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Parse the input to a number
    const parsedValue = parseFloat(localValue);
    // Pass parsed number to form (NaN if invalid, validation will handle it)
    onChange(isNaN(parsedValue) ? NaN : parsedValue);
    if (onBlur) onBlur();
  };

  return (
    <div className="mb-4">
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} htmlFor={id} required={required} />
        ) : (
          label
        ))}
      <Input
        value={isFocused ? localValue : formatCurrency(value, currency)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        id={id}
        className={error ? 'border-red-500' : ''}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputCurrency;
