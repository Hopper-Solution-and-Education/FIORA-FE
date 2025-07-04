'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { useState } from 'react';
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
  formatValue?: (value: number, isEditing: boolean) => string | number;
  tooltipFormat?: (value: number) => string;
  step?: number;
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
  formatValue,
  tooltipFormat,
  step = 1,
}: NumberRangeFilterProps) => {
  const [isMinEditing, setIsMinEditing] = useState(false);
  const [isMaxEditing, setIsMaxEditing] = useState(false);
  const [tempMinValue, setTempMinValue] = useState('');
  const [tempMaxValue, setTempMaxValue] = useState('');

  // Calculate an appropriate step based on the range size if not provided
  const calculatedStep =
    step === 1 && maxRange - minRange > 1000
      ? Math.pow(10, Math.floor(Math.log10((maxRange - minRange) / 100)))
      : step;

  const getFormattedValue = (value: number, isEditing: boolean) => {
    if (formatValue) {
      return formatValue(value, isEditing);
    }
    return isEditing ? value : value.toLocaleString();
  };

  const getTooltipContent = (value: number) => {
    if (tooltipFormat) {
      return tooltipFormat(value);
    }
    return value.toLocaleString();
  };

  const validateAndUpdateValue = (target: 'minValue' | 'maxValue', inputValue: string) => {
    // Remove commas and other formatting characters
    const rawValue = inputValue.replace(/[^\d.-]/g, '');
    const numericValue = Number(rawValue);

    if (isNaN(numericValue)) {
      return; // Don't update if invalid number
    }

    let validatedValue = numericValue;

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

  const handleInputChange = (target: 'minValue' | 'maxValue', value: string) => {
    // Allow free typing - store in temporary state
    if (target === 'minValue') {
      setTempMinValue(value);
    } else {
      setTempMaxValue(value);
    }
  };

  const handleInputFocus = (target: 'minValue' | 'maxValue') => {
    if (target === 'minValue') {
      setIsMinEditing(true);
      setTempMinValue(minValue.toString());
    } else {
      setIsMaxEditing(true);
      setTempMaxValue(maxValue.toString());
    }
  };

  const handleInputBlur = (target: 'minValue' | 'maxValue') => {
    const tempValue = target === 'minValue' ? tempMinValue : tempMaxValue;
    validateAndUpdateValue(target, tempValue);

    if (target === 'minValue') {
      setIsMinEditing(false);
      setTempMinValue('');
    } else {
      setIsMaxEditing(false);
      setTempMaxValue('');
    }
  };

  const handleKeyPress = (target: 'minValue' | 'maxValue', e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const tempValue = target === 'minValue' ? tempMinValue : tempMaxValue;
      validateAndUpdateValue(target, tempValue);

      if (target === 'minValue') {
        setIsMinEditing(false);
        setTempMinValue('');
      } else {
        setIsMaxEditing(false);
        setTempMaxValue('');
      }

      // Remove focus from input
      (e.target as HTMLInputElement).blur();
    }
  };

  const getInputValue = (target: 'minValue' | 'maxValue') => {
    if (target === 'minValue') {
      return isMinEditing ? tempMinValue : getFormattedValue(minValue, false);
    } else {
      return isMaxEditing ? tempMaxValue : getFormattedValue(maxValue, false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Label className="mb-2 w-full text-left">{label}</Label>
      <div className="w-full flex flex-row items-center justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                value={getInputValue('minValue')}
                min={minRange}
                max={maxRange}
                onFocus={() => handleInputFocus('minValue')}
                onBlur={() => handleInputBlur('minValue')}
                onKeyPress={(e) => handleKeyPress('minValue', e)}
                placeholder={minLabel}
                onChange={(e) => handleInputChange('minValue', e.target.value)}
                required
                className={cn('w-[45%]')}
              />
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
              <Input
                value={getInputValue('maxValue')}
                min={minRange}
                max={maxRange}
                placeholder={maxLabel}
                onFocus={() => handleInputFocus('maxValue')}
                onBlur={() => handleInputBlur('maxValue')}
                onKeyPress={(e) => handleKeyPress('maxValue', e)}
                onChange={(e) => handleInputChange('maxValue', e.target.value)}
                required
                className={cn('w-[45%]')}
              />
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
