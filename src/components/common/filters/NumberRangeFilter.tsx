'use client';

import InputCurrency from '@/components/common/forms/input/InputCurrency';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
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
  tooltipFormat?: (value: number) => string;
  step?: number;
  currency?: string;
}

const NumberRangeFilter = ({
  minValue,
  maxValue,
  minRange,
  maxRange,
  onValueChange,
  label = 'Range',
  minLabel = 'Min',
  maxLabel = 'Max',
  tooltipFormat,
  step = 1,
  currency = 'USD',
}: NumberRangeFilterProps) => {
  // Calculate an appropriate step based on the range size if not provided
  const calculatedStep =
    step === 1 && maxRange - minRange > 1000
      ? Math.pow(10, Math.floor(Math.log10((maxRange - minRange) / 100)))
      : step;

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

    onValueChange(target, validatedValue);
  };

  const handleMinValueChange = (value: number) => {
    validateAndUpdateValue('minValue', value);
  };

  const handleMaxValueChange = (value: number) => {
    validateAndUpdateValue('maxValue', value);
  };

  const getTooltipContent = (value: number) => {
    if (tooltipFormat) {
      return tooltipFormat(value);
    }
    return value.toLocaleString();
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
                  currency={currency}
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
                  currency={currency}
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
        handleUpdate: onValueChange,
        step: calculatedStep,
        formatValue: tooltipFormat,
      })}
    </div>
  );
};

export default NumberRangeFilter;
