import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldError } from 'react-hook-form';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
}) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={error ? 'border-red-500' : ''}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

export default InputField;
