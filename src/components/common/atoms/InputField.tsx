import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Input } from '@/components/ui/input';
import React from 'react';
import { FieldError } from 'react-hook-form';

interface InputFieldProps {
  value?: string;
  name?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  [key: string]: any;
  maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder,
  id,
  required,
  ...props
}) => (
  <div className="mb-4">
    {label &&
      (typeof label === 'string' ? (
        <GlobalLabel text={label} htmlFor={id} required={required} />
      ) : (
        label
      ))}
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      id={id}
      className={error ? 'border-red-500' : ''}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

export default InputField;
