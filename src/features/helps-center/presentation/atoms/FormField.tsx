import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'input' | 'textarea';
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'input',
  placeholder,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          rows={3}
        />
      ) : (
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
