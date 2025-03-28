import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldError } from 'react-hook-form';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';

interface InputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  [key: string]: any;
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder,
  id,
  ...props
}) => (
  <div className="mb-4">
    {label && (typeof label === 'string' ? <GlobalLabel text={label} htmlFor={id} /> : label)}
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
