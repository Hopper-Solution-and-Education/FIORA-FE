'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { FieldError } from 'react-hook-form';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { cn } from '@/lib/utils';
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
  previewShape?: 'square' | 'circle';
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
  previewShape = 'square',
  ...props
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [currentShape, setCurrentShape] = useState<'square' | 'circle'>(previewShape);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLLabelElement>(null);

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

  const handleClearImage = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleShape = () => {
    setCurrentShape((prev) => (prev === 'square' ? 'circle' : 'square'));
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Get the first file
      const file = e.dataTransfer.files[0];

      // Check if the file type matches the accept attribute
      if (accept) {
        const acceptTypes = accept.split(',').map((type) => type.trim());
        const fileType = file.type;

        const isAccepted = acceptTypes.some((type) => {
          if (type === 'image/*' && fileType.startsWith('image/')) return true;
          if (type === fileType) return true;
          if (type.endsWith('/*') && fileType.startsWith(type.replace('/*', '/'))) return true;
          return false;
        });

        if (!isAccepted) {
          // File type not accepted
          return;
        }
      }

      // Process the file
      onChange(file);

      // Update the file input value for consistency
      if (fileInputRef.current) {
        // Create a DataTransfer object to set the files
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <div className="space-y-3">
      {label && <GlobalLabel text={label} required={required} htmlFor={id} />}
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-sm overflow-hidden">
        <label
          ref={dropAreaRef}
          htmlFor={id}
          className={cn(
            'flex items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 group',
            isDragging
              ? 'border-primary border-solid bg-primary/5'
              : 'border-primary/20 hover:border-primary/40',
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Input
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            onBlur={onBlur}
            className="hidden"
            ref={fileInputRef}
            {...props}
          />
          {preview ? (
            <div className="relative">
              <img
                src={preview || '/placeholder.svg'}
                alt="Preview"
                className={cn(
                  'w-32 h-32 object-cover border border-primary/10 transition-all duration-300 transform group-hover:scale-105',
                  'shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
                  currentShape === 'circle' ? 'rounded-full' : 'rounded-md',
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center',
                  currentShape === 'circle' ? 'rounded-full' : 'rounded-md',
                )}
              >
                <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  Change Image
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-white/50 dark:bg-slate-800/50 rounded-lg shadow-sm backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {isDragging ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {isDragging ? 'Drop image here' : placeholder}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isDragging ? 'Release to upload' : 'Click or drag & drop'}
              </span>
            </div>
          )}
        </label>

        {preview && (
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              type="button"
              onClick={toggleShape}
              className="w-8 h-8 bg-white dark:bg-slate-800 text-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary/10"
              aria-label="Toggle shape"
            >
              {currentShape === 'square' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={handleClearImage}
              className="w-8 h-8 bg-white dark:bg-slate-800 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-red-200 dark:border-red-900/30"
              aria-label="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center mt-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default UploadField;
