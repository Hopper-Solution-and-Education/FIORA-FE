'use client';

import React, { useState, useEffect } from 'react';
import { FieldError } from 'react-hook-form';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { cn } from '@/shared/utils';
import { Input } from '@/components/ui/input';

interface UploadFieldProps {
  name: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  accept?: string;
  id?: string;
  required?: boolean;
  [key: string]: any;
}

const UploadField: React.FC<UploadFieldProps> = ({
  name,
  value,
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder = 'Choose Image',
  accept = 'image/*',
  id = name,
  required = false,
  ...props
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const previewUrl = URL.createObjectURL(value);
      setPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      {label && <GlobalLabel text={label} required={required} htmlFor={id} />}
      <label
        htmlFor={id}
        className="relative flex items-center justify-center w-full h-40 border-2 border-dashed border-input rounded-lg cursor-pointer transition-all group"
      >
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          onBlur={onBlur}
          className="hidden"
          {...props}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-28 h-28 object-cover rounded-md border border-input shadow-sm group-hover:opacity-70"
          />
        )}
        <span
          className={cn(
            'absolute text-sm text-foreground transition-all',
            preview
              ? 'opacity-0 group-hover:opacity-100 bg-background/50 px-1.5 py-1 rounded-md'
              : 'opacity-100',
          )}
        >
          {placeholder}
        </span>
      </label>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default UploadField;
