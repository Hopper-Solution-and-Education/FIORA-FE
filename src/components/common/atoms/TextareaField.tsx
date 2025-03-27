import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FieldError } from 'react-hook-form';

interface TextareaFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: string;
  placeholder?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <Textarea
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default TextareaField;
