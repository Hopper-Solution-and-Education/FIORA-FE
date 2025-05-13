import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Input } from '@/components/ui/input';
import React, { memo, useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { formatCurrency, formatSuggestionValue } from './utils';
import { Button } from '@/components/ui/button';
import { Currency } from '@/shared/types';

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
  maxLength?: number;
  showSuggestion?: boolean;
  mode?: 'onBlur' | 'onChange';
  [key: string]: any;
}

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
  maxLength,
  showSuggestion = false,
  mode = 'onBlur',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value ? value.toString() : '');
  const [showSuggestionValue, setShowSuggestionValue] = useState(showSuggestion);

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
    if (mode === 'onChange') {
      const parsedValue = parseFloat(e.target.value);
      onChange(isNaN(parsedValue) ? 0 : parsedValue);
    }
    if (value > 0) {
      setShowSuggestionValue(true);
    }
  };

  const handleSuggestionClick = (value: number) => {
    setShowSuggestionValue(false);
    onChange(value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Parse the input to a number
    const parsedValue = parseFloat(localValue);
    // Pass parsed number to form (NaN if invalid, validation will handle it)
    onChange(isNaN(parsedValue) ? 0 : parsedValue);
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
        maxLength={maxLength}
        id={id}
        className={error ? 'border-red-500' : ''}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      {value > 0 && showSuggestionValue && (
        <div className="w-[100%] flex flex-col justify-between items-start overflow-y-hidden overflow-x-auto">
          {/* Increate button group */}
          <div className="w-full h-11 flex justify-evenly items-center gap-2 py-2">
            <Button
              type="button"
              variant={'secondary'}
              className="w-full h-full"
              onClick={() => handleSuggestionClick(value * 10)}
            >
              {formatSuggestionValue(value * 10, currency as Currency, true)}
            </Button>
            <Button
              type="button"
              variant={'secondary'}
              className="w-full h-full"
              onClick={() => handleSuggestionClick(value * 100)}
            >
              {formatSuggestionValue(value * 100, currency as Currency, true)}
            </Button>
            <Button
              type="button"
              variant={'secondary'}
              className="w-full h-full"
              onClick={() => handleSuggestionClick(value * 1000)}
            >
              {formatSuggestionValue(value * 1000, currency as Currency, true)}
            </Button>
            <Button
              type="button"
              variant={'secondary'}
              className="w-full h-full"
              onClick={() => handleSuggestionClick(value * 10000)}
            >
              {formatSuggestionValue(value * 10000, currency as Currency, true)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(InputCurrency);
