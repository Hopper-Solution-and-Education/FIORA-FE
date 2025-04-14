'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { AlertTriangle, Circle, Image as ImageIcon, Square, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import type { FieldError } from 'react-hook-form';

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
  initialImageUrl?: string | null;
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
  initialImageUrl = null,
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
    }
  }, [value]);

  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
    }
  }, [initialImageUrl]);

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
      const file = e.dataTransfer.files[0];
      if (accept) {
        const acceptTypes = accept.split(',').map((type) => type.trim());
        const fileType = file.type;
        const isAccepted = acceptTypes.some((type) => {
          if (type === 'image/*' && fileType.startsWith('image/')) return true;
          if (type === fileType) return true;
          if (type.endsWith('/*') && fileType.startsWith(type.replace('/*', '/'))) return true;
          return false;
        });

        if (!isAccepted) return;
      }
      onChange(file);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  return (
    <div className="space-y-3">
      {label && <GlobalLabel text={label} required={required} htmlFor={id} />}
      <div className="relative w-full h-48 overflow-hidden border-2 border-dashed rounded-lg">
        <label
          ref={dropAreaRef}
          htmlFor={id}
          className={cn(
            'flex items-center justify-center w-full h-full cursor-pointer transition-all duration-300 group',
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
            <div className="relative w-32 h-32">
              <div
                className={cn(
                  'w-full h-full overflow-hidden',
                  currentShape === 'circle' ? 'rounded-full' : 'rounded-md',
                )}
              >
                <Image
                  src={preview || '/placeholder.svg'}
                  alt="Preview"
                  width={128}
                  height={128}
                  className={cn(
                    'object-cover border border-primary/10 transition-all duration-300 transform group-hover:scale-105',
                    'shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full h-full',
                  )}
                  style={{ objectFit: 'cover' }}
                />
              </div>
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
            <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {isDragging ? (
                  <Upload className="h-6 w-6 text-primary animate-pulse" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-primary" />
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
              className="w-8 h-8 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 text-primary rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 border border-primary/10 hover:border-primary/20"
              aria-label="Toggle shape"
            >
              {currentShape === 'square' ? (
                <Circle className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleClearImage}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 text-red-500 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 border border-red-200/20 hover:border-red-200/40 dark:border-red-900/30"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center mt-1.5">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default memo(UploadField);
