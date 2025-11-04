'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import InputCurrency from '@/components/common/forms/input/InputCurrency';
import { Label } from '@/components/ui/label';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { formatCurrencyNumber, RoundingMode } from '@/shared/utils/currencyFormat';
import { useAppSelector } from '@/store';
import { debounce } from 'lodash';
import { useCallback, useMemo } from 'react';
import { renderRangeSlider } from './renderRangeSlider';

interface NumberRangeFilterProps {
  minValue: number;
  maxValue: number;
  minRange: number;
  maxRange: number;
  onValueChange: (target: 'minValue' | 'maxValue', value: number) => void;
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  tooltipFormat?: (value: number, currency: string) => string;
  currency?: string;
  applyExchangeRate?: boolean;
  shouldShortened?: boolean;
  targetCurrency?: string;
  step?: number;
}

const NumberRangeFilter = (props: NumberRangeFilterProps) => {
  const { currency: settingCurrency } = useAppSelector((state) => state.settings);
  const { formatCurrency, getExchangeRate } = useCurrencyFormatter();

  const {
    minValue: baseCurrencyMinValue,
    maxValue: baseCurrencyMaxValue,
    minRange: baseCurrencyMinRange,
    maxRange: baseCurrencyMaxRange,
    onValueChange,
    label = 'Range',
    minLabel = 'Min',
    maxLabel = 'Max',
    tooltipFormat = formatCurrency,
    currency = CURRENCY.USD,
    applyExchangeRate = true,
    shouldShortened = false,
    targetCurrency = settingCurrency,
  } = props;

  const exchangeRate = getExchangeRate(currency, targetCurrency) || 1;

  /// format và parse để input 900 tới 999 không bị sai số nhị phân tích lũy.
  const minValue = parseFloat(
    formatCurrencyNumber(baseCurrencyMinValue * exchangeRate, RoundingMode.NORMAL),
  );
  const maxValue = parseFloat(
    formatCurrencyNumber(baseCurrencyMaxValue * exchangeRate, RoundingMode.NORMAL),
  );
  const minRange = parseFloat(
    formatCurrencyNumber(baseCurrencyMinRange * exchangeRate, RoundingMode.NORMAL),
  );
  const maxRange = parseFloat(
    formatCurrencyNumber(baseCurrencyMaxRange * exchangeRate, RoundingMode.NORMAL),
  );

  console.log('update lai', maxValue);

  // Minimum gap between min and max values (adjustable based on your needs)
  const MIN_GAP = 100;
  // Debounced onValueChange for smoother updates
  const debouncedOnValueChange = useMemo(
    () =>
      debounce((target: 'minValue' | 'maxValue', value: number) => {
        onValueChange(target, value);
      }, 300),
    [onValueChange],
  );

  const validateAndUpdateValue = useCallback(
    (target: 'minValue' | 'maxValue', inputValue: number) => {
      let validatedValue = inputValue;

      // Apply range bounds first
      validatedValue = Math.max(minRange, Math.min(maxRange, validatedValue));

      // Apply cross-validation between min and max with minimum gap
      if (target === 'minValue') {
        // If setting minValue, ensure it doesn't exceed maxValue minus MIN_GAP
        if (validatedValue > maxValue - MIN_GAP) {
          validatedValue = maxValue - MIN_GAP;
        }
        // Ensure minValue doesn't go below minRange
        if (validatedValue < minRange) {
          validatedValue = minRange;
        }
      } else {
        // If setting maxValue, ensure it's not less than minValue plus MIN_GAP
        if (validatedValue < minValue + MIN_GAP) {
          validatedValue = minValue + MIN_GAP;
        }
        // Ensure maxValue doesn't exceed maxRange
        if (validatedValue > maxRange) {
          validatedValue = maxRange;
        }
      }

      // Convert back to baseCurrency before calling onValueChange
      const baseCurrencyValue = validatedValue / exchangeRate;
      debouncedOnValueChange(target, baseCurrencyValue);
    },
    [minRange, maxRange, minValue, maxValue, exchangeRate, debouncedOnValueChange, MIN_GAP],
  );

  const handleMinValueChange = (value: number) => {
    validateAndUpdateValue('minValue', value);
  };

  const handleMaxValueChange = (value: number) => {
    validateAndUpdateValue('maxValue', value);
  };

  const getTooltipContent = (value: number) => {
    if (tooltipFormat) {
      return tooltipFormat(value, targetCurrency);
    }
    return formatCurrency(value, targetCurrency, { applyExchangeRate, shouldShortened });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Label className="mb-2 w-full text-left">{label}</Label>
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <CommonTooltip content={getTooltipContent(minValue)}>
          <div className="w-full sm:flex-1 h-[40px] flex items-center">
            <InputCurrency
              value={minValue}
              onChange={handleMinValueChange}
              placeholder={minLabel}
              currency={targetCurrency}
              showSuggestion={false}
              mode="onBlur"
              classContainer="mb-0 w-full"
              className={cn('w-full text-sm')}
            />
          </div>
        </CommonTooltip>

        <Label className="mx-2 text-sm text-muted-foreground shrink-0">to</Label>

        <CommonTooltip content={getTooltipContent(maxValue)}>
          <div className="w-full sm:flex-1 h-[40px] flex items-center">
            <InputCurrency
              value={maxValue}
              onChange={handleMaxValueChange}
              placeholder={maxLabel}
              currency={targetCurrency}
              showSuggestion={false}
              mode="onBlur"
              classContainer="mb-0 w-full"
              className={cn('w-full text-sm')}
            />
          </div>
        </CommonTooltip>
      </div>

      {renderRangeSlider({
        minValue,
        maxValue,
        minRange,
        maxRange,
        handleUpdate: (target: 'minValue' | 'maxValue', value: number) => {
          // Validate min <= max with minimum gap
          let validatedValue = value;

          if (target === 'minValue' && value > maxValue - MIN_GAP) {
            validatedValue = maxValue - MIN_GAP;
          } else if (target === 'maxValue' && value < minValue + MIN_GAP) {
            validatedValue = minValue + MIN_GAP;
          }

          // Convert back to baseCurrency before calling onValueChange
          const baseCurrencyValue = validatedValue / exchangeRate;
          onValueChange(target, baseCurrencyValue);
        },
        step: 1,
        formatValue: (value: number) =>
          formatCurrency(value, targetCurrency, { applyExchangeRate, shouldShortened }),
      })}
    </div>
  );
};

export default NumberRangeFilter;
