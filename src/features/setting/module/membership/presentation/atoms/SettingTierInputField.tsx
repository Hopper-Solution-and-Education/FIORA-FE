'use client';

import InputField from '@/components/common/forms/input/InputField';
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
      "
    >
      <span
        className="
          text-xs
          sm:text-sm
          md:text-sm
          lg:text-sm
          font-semibold text-gray-700 dark:text-gray-200
        "
      >
        {label}
      </span>

      {/* Input Field Container and InputField itself */}
      <div
        className="
          w-full
          flex justify-end
        "
      >
        <InputField
          name={name}
          value={value.toString()}
          onChange={(e) => onChange(Number(e))}
          error={error}
          options={options}
          placeholder="0"
          required={required}
          onBlur={onBlur}
          className={cn(
            'text-center',
            'w-[60px]',
            'sm:w-[70px]',
            'md:w-[80px]',
            'text-xs sm:text-sm md:text-sm',
          )}
        />
      </div>

      {/* Suffix */}
      {suffix && (
        <span
          className="
            text-xs
            mb-4
            sm:text-xs
            md:text-sm
            lg:text-sm
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
