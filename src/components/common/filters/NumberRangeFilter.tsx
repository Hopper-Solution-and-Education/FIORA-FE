'use client';

import InputCurrency from '@/components/common/forms/input/InputCurrency';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
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
  step?: number;
  currency?: string;
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
    step = 1, // eslint-disable-line @typescript-eslint/no-unused-vars
    currency = CURRENCY.USD,
  } = props;

  // Convert values from baseCurrency to settingCurrency
  const exchangeRate = getExchangeRate(currency, settingCurrency) || 1;

  const minValue = baseCurrencyMinValue * exchangeRate;
  const maxValue = baseCurrencyMaxValue * exchangeRate;
  const minRange = baseCurrencyMinRange * exchangeRate;
  const maxRange = baseCurrencyMaxRange * exchangeRate;

  const validateAndUpdateValue = (target: 'minValue' | 'maxValue', inputValue: number) => {
    let validatedValue = inputValue;

    // Apply range bounds first
    validatedValue = Math.max(minRange, Math.min(maxRange, validatedValue));

    // Apply cross-validation between min and max
    if (target === 'minValue') {
      // If setting minValue, ensure it doesn't exceed maxValue
      if (validatedValue > maxValue) {
        validatedValue = maxValue;
      }
    } else {
      // If setting maxValue, ensure it's not less than minValue
      if (validatedValue < minValue) {
        validatedValue = minValue + 1; // Set to minValue + 1 to maintain valid range
      }
    }

    // Convert back to baseCurrency before calling onValueChange
    const baseCurrencyValue = validatedValue / exchangeRate;
    onValueChange(target, baseCurrencyValue);
  };

  const handleMinValueChange = (value: number) => {
    validateAndUpdateValue('minValue', value);
  };

  const handleMaxValueChange = (value: number) => {
    validateAndUpdateValue('maxValue', value);
  };

  const getTooltipContent = (value: number) => {
    if (tooltipFormat) {
      return tooltipFormat(value, settingCurrency);
    }
    return formatCurrency(value, settingCurrency, { applyExchangeRate: false });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Label className="mb-2 w-full text-left">{label}</Label>
      <div className="w-full flex flex-row items-center justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-[45%] h-[40px] overflow-y-hidden">
                <InputCurrency
                  value={minValue}
                  onChange={handleMinValueChange}
                  placeholder={minLabel}
                  currency={settingCurrency}
                  showSuggestion={false}
                  mode="onChange"
                  classContainer="mb-0"
                  className={cn('w-full')}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipContent(minValue)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Label className="mx-0.5">to</Label>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-[45%] h-[40px] overflow-y-hidden">
                <InputCurrency
                  value={maxValue}
                  onChange={handleMaxValueChange}
                  placeholder={maxLabel}
                  currency={settingCurrency}
                  showSuggestion={false}
                  mode="onChange"
                  classContainer="mb-0"
                  className={cn('w-full')}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipContent(maxValue)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {renderRangeSlider({
        minValue,
        maxValue,
        minRange,
        maxRange,
        handleUpdate: (target: 'minValue' | 'maxValue', value: number) => {
          // Convert back to baseCurrency before calling onValueChange
          const baseCurrencyValue = value / exchangeRate;
          onValueChange(target, baseCurrencyValue);
        },
        step: 1, // Always use step of 1 for converted currency values
        formatValue: (value: number) =>
          formatCurrency(value, settingCurrency, { applyExchangeRate: false }),
      })}
    </div>
  );
};

export default NumberRangeFilter;
