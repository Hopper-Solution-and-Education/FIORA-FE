'use client';

import InputField from '@/components/common/forms/input/InputField';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { FieldError } from 'react-hook-form';

export interface SettingTierInputProps {
  label: string;
  value: number;
  name?: string;
  onChange: (value: number) => void;
  error?: FieldError;
  suffix?: string;
  required?: boolean;
  onBlur?: () => void;
  options?: {
    percent?: boolean;
    maxPercent?: number;
  };
  disabled?: boolean;
}

const SettingTierInputField = ({
  label,
  value,
  name,
  onChange,
  error,
  suffix,
  required,
  onBlur,
  options,
  disabled,
}: SettingTierInputProps) => {
  return (
    <div
      className="
        grid
        gap-x-2
        grid-cols-[1fr_auto_minmax(40px,_70px)]
        sm:grid-cols-[1fr_auto_minmax(60px,_90px)]
        md:grid-cols-[1fr_80px_100px]
        items-center
        overflow-hidden
        text-ellipsis
        whitespace-nowrap
      "
    >
      <span
        className="
          text-xxs
          sm:text-xs
          md:text-xs
          lg:text-sm
          font-semibold text-gray-700 dark:text-gray-200
          mb-1
          gap-2
          flex justify-start
          w-36
        "
      >
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      {/* Input Field Container and InputField itself */}
      <div
        className="
          w-full
          flex justify-end
          m-0
          pr-1
        "
      >
        <TooltipProvider>
          <Tooltip open={!!error?.message}>
            <TooltipTrigger asChild>
              <InputField
                name={name}
                value={value?.toString() ?? '0'}
                onChange={(e) => onChange(e as unknown as number)}
                options={options}
                placeholder="0"
                required={required}
                onBlur={onBlur ? onBlur : undefined}
                disabled={disabled}
                className={cn(
                  'text-center',
                  'w-[60px]',
                  'sm:w-[70px]',
                  'md:w-[80px]',
                  'text-xs sm:text-sm md:text-sm',
                  error && 'border-red-500',
                )}
              />
            </TooltipTrigger>
            {error?.message && (
              <TooltipContent>
                <span className="text-red-500 text-xs">{error.message}</span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Suffix */}
      {suffix && (
        <span
          className="
            text-xxs
            sm:text-xs
            md:text-xs
            lg:text-xs
            mb-1
            text-gray-500 dark:text-gray-400
            overflow-hidden
            text-ellipsis
            whitespace-nowrap
          "
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

export default SettingTierInputField;
