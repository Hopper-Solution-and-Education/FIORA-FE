import React from 'react';
import { FieldError } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string; image?: string }[];
}
const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
  options,
}) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={error ? 'border-red-500' : ''} onBlur={onBlur}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

export default SelectField;
