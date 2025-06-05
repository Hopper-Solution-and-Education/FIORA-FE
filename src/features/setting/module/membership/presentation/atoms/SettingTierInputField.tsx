'use client';

import InputField from '@/components/common/forms/input/InputField';
import { FieldError } from 'react-hook-form';

export interface SettingTierInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
  suffix?: string;
  options?: {
    percent?: boolean;
    maxPercent?: number;
  };
}

const SettingTierInputField = ({
  label,
  value,
  onChange,
  error,
  suffix,
  options,
}: SettingTierInputProps) => {
  return (
    <div className="grid grid-cols-[1fr_80px_100px] items-center gap-7">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
      <div className="w-18">
        <InputField
          value={value}
          onChange={onChange}
          error={error}
          options={options}
          placeholder="0"
        />
      </div>
      {suffix && (
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{suffix}</span>
      )}
    </div>
  );
};

export default SettingTierInputField;
