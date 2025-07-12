'use client';

import InputField from '@/components/common/forms/input/InputField';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import { cn } from '@/shared/utils';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
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
  showRemove?: boolean;
  onRemove?: () => void;
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
  showRemove,
  onRemove,
}: SettingTierInputProps) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="relative group overflow-hidden"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
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
            max-w-[144px]
            truncate
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
                    'my-1',
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
      {/* Trash icon button, show on hover */}
      {showRemove && (
        <button
          type="button"
          className={`absolute right-0 top-1/3 -translate-y-1/2 p-2 text-destructive hover:bg-destructive/10 rounded-full
            transition-all duration-300 ease-in-out
            ${isHover ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'}`}
          onClick={onRemove}
          tabIndex={-1}
        >
          <Trash2 size={ICON_SIZE.SM} />
        </button>
      )}
    </div>
  );
};

export default SettingTierInputField;
