import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Currency } from '@/shared/types';
import { cn } from '@/shared/utils';
import React, { memo, useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { formatCurrency, formatSuggestionValue } from './utils';

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
  classContainer?: string;
  className?: string;
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
  classContainer,
  className,
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
    // Only allow up to 11 digits
    const newValue = e.target.value.replace(/[^\d.]/g, '');
    if (newValue.length > 11) return;

    // Update local value as the user types
    setLocalValue(newValue);
    if (mode === 'onChange') {
      const parsedValue = parseFloat(newValue);
      onChange(isNaN(parsedValue) ? 0 : parsedValue);
    }
    if (value > 0) {
      setShowSuggestionValue(true);
    }

    if (value >= 1000000000) {
      setShowSuggestionValue(false);
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
    <div className={cn('mb-4', classContainer)}>
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
        className={error ? 'border-red-500' : `${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      {value > 0 && showSuggestionValue && (
        <div className="w-[100%] flex flex-col justify-between items-start overflow-y-hidden overflow-x-auto">
          {/* Increate button group */}
          <div className="w-full h-11 flex justify-evenly items-center gap-2 py-2">
            {[{ mul: 10 }, { mul: 100 }, { mul: 1000 }, { mul: 10000 }].map(({ mul }, idx) => {
              let suggestionValue = value * mul;
              if (suggestionValue > 10_000_000_000) suggestionValue = 10_000_000_000;
              // Không render nếu suggestionValue nhỏ hơn value hiện tại hoặc đã trùng với suggestion trước đó
              if (suggestionValue <= value) return null;
              // Đảm bảo không render suggestion trùng nhau
              if (idx > 0) {
                const prevMul = [10, 100, 1000, 10000][idx - 1];
                let prevValue = value * prevMul;
                if (prevValue > 10_000_000_000) prevValue = 10_000_000_000;
                if (prevValue === suggestionValue) return null;
              }
              return (
                <Button
                  key={mul}
                  type="button"
                  variant={'secondary'}
                  className="w-full h-full"
                  onClick={() => handleSuggestionClick(suggestionValue)}
                >
                  {formatSuggestionValue(suggestionValue, currency as Currency, true)}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(InputCurrency);
