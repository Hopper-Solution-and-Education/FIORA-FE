'use client';

import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

interface IconUploaderProps {
  fieldPath: string;
  maxSize?: number;
}

const IconUploader: React.FC<IconUploaderProps> = ({ fieldPath, maxSize = 2 * 1024 * 1024 }) => {
  const { setValue, watch } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const iconUrl = watch(fieldPath);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'] },
    maxSize: maxSize,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setValue(fieldPath, fileUrl, { shouldValidate: true });
        setFileName(file.name);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        alert(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        alert('Invalid file type. Please upload an image file.');
      }
    },
  });

  const handleRemoveFile = () => {
    setValue(fieldPath, '', { shouldValidate: true });
    setFileName(null);
  };

  return (
    <div className="space-y-2">
      {/* <Label htmlFor={fieldPath} className="text-sm font-medium mb-2">
        {label} <span className="text-red-500">*</span>
      </Label> */}

      {!iconUrl ? (
        // Upload Section
        <div
          {...getRootProps()}
          className={`border border-dashed rounded-md p-4 text-center cursor-pointer transition-colors flex items-center justify-center h-[150px] ${
            isDragActive
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <div>
            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Drag & drop an icon, or click to select</p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, SVG, GIF up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      ) : (
        // Preview Section
        <div className="relative border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center h-[140px]">
          <Image
            src={iconUrl}
            alt="Icon preview"
            className="max-h-[140px] max-w-[200px] object-contain"
            width={140}
            height={140}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg?height=80&width=80';
              (e.target as HTMLImageElement).alt = 'Invalid icon URL';
            }}
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={handleRemoveFile}
            className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {fileName && (
        <p className="text-xs text-gray-500 mt-2 truncate" title={fileName}>
          {fileName}
        </p>
      )}
    </div>
  );
};

export default IconUploader;
