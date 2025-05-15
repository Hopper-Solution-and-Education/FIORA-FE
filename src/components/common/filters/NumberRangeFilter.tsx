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

  const handleInputChange = (target: 'minValue' | 'maxValue', value: string) => {
    // Remove commas and other formatting characters
    const rawValue = value.replace(/[^\d.-]/g, '');
    const numericValue = Number(rawValue);

    if (!isNaN(numericValue)) {
      const bounded =
        target === 'minValue'
          ? Math.max(minRange, Math.min(maxValue, numericValue))
          : Math.max(minValue, Math.min(maxRange, numericValue));

      onValueChange(target, bounded);
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
                value={getFormattedValue(minValue, isMinEditing)}
                min={minRange}
                max={maxRange}
                onFocus={(e) => {
                  setIsMinEditing(true);
                  e.target.select();
                }}
                onBlur={() => setIsMinEditing(false)}
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
                value={getFormattedValue(maxValue, isMaxEditing)}
                min={minRange}
                max={maxRange}
                placeholder={maxLabel}
                onFocus={(e) => {
                  setIsMaxEditing(true);
                  e.target.select();
                }}
                onBlur={() => setIsMaxEditing(false)}
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
