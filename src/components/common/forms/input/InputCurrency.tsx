import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import {
  applyRounding,
  CURRENCY_CONSTANTS,
  formatCurrencyNumber,
  isValidCurrencyAmount,
  RoundingMode,
  validateCurrencyInput,
} from '@/shared/utils/currencyFormat';
import React, { memo, useState } from 'react';
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
  maxLength?: number;
  showSuggestion?: boolean;
  mode?: 'onBlur' | 'onChange';
  classContainer?: string;
  className?: string;
  isFullCurrencyDisplay?: boolean;
  roundingMode?: RoundingMode;
  allowNegative?: boolean;
  [key: string]: any;
  applyExchangeRate?: boolean;
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
  applyExchangeRate = false,
  roundingMode = RoundingMode.NORMAL,
  allowNegative = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionValue, setShowSuggestionValue] = useState(showSuggestion);
  const { formatCurrency } = useCurrencyFormatter();
  const [localValue, setLocalValue] = useState(
    formatCurrency(value, currency, { applyExchangeRate }),
  );

  const handleFocus = () => {
    setIsFocused(true);
    // Show unformatted number for editing
    setLocalValue(value ? value.toString() : '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const regex = /^\d+(\.\d*)?$/;
    if (inputValue !== '' && !regex.test(inputValue)) {
      return;
    }

    // Use helper function to validate and format input
    const { isValid, formatted } = validateCurrencyInput(inputValue, allowNegative);

    // If input is invalid (exceeds limits), don't update
    if (!isValid && inputValue !== '') {
      return;
    }

    // If input is negative
    if (allowNegative && inputValue.startsWith('-') && !localValue.includes('-')) {
      setLocalValue(inputValue);
    } else {
      // Update local value with formatted input
      setLocalValue(formatted);
    }

    // Handle real-time validation and onChange mode
    if (mode === 'onChange') {
      const parsedValue = parseFloat(formatted);
      let finalValue = isNaN(parsedValue) ? 0 : parsedValue;

      // Additional validation: ensure the number is within valid range
      if (!isValidCurrencyAmount(finalValue, allowNegative)) {
        return;
      }

      // Apply rounding if the input has more than 2 decimal places
      const decimalPlaces = (formatted.split('.')[1] || '').length;
      if (decimalPlaces > CURRENCY_CONSTANTS.MAX_DECIMAL_DIGITS) {
        finalValue = applyRounding(finalValue, roundingMode);
      }

      onChange(finalValue);

      // Show/hide suggestions based on value (only for positive values)
      if (finalValue > 0 && finalValue < 1000000000) {
        setShowSuggestionValue(true);
      } else {
        setShowSuggestionValue(false);
      }
    }
  };

  const handleSuggestionClick = (value: number) => {
    setShowSuggestionValue(false);
    onChange(value);
  };

  const handleBlur = () => {
    setIsFocused(false);

    const { formatted } = validateCurrencyInput(localValue, allowNegative);

    // Parse the input to a number and validate
    const parsedValue = parseFloat(formatted);
    const finalValue = isNaN(parsedValue) ? 0 : parsedValue;

    // Format the final value to ensure it meets our requirements
    if (finalValue !== 0 && isValidCurrencyAmount(finalValue, allowNegative)) {
      // Use helper function to format the number properly with rounding
      const formattedNumber = formatCurrencyNumber(finalValue, roundingMode);
      const numericValue = parseFloat(formattedNumber);

      // Update both local value and form value
      setLocalValue(formattedNumber);
      onChange(numericValue);
    } else {
      // Handle zero or invalid values
      setLocalValue('');
      onChange(0);
    }

    if (onBlur) onBlur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
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
        value={isFocused ? localValue : formatCurrency(value, currency, { applyExchangeRate })}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
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
                  {formatCurrency(suggestionValue, currency, {
                    shouldShortened: true,
                    applyExchangeRate,
                  })}
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
