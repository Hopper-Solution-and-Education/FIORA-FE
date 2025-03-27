'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/utils';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

interface IconUploaderProps {
  fieldPath: string;
  label?: string;
  maxSize?: number;
}

const IconUploader: React.FC<IconUploaderProps> = ({
  fieldPath,
  label = 'Product Icon',
  maxSize = 2 * 1024 * 1024,
}) => {
  const { register, setValue, watch } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);

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

  const iconUrl = watch(fieldPath);

  const handleRemoveFile = () => {
    setValue(fieldPath, '', { shouldValidate: true });
    setFileName(null);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Area */}
        <div className="flex flex-col h-[220px]">
          <Label htmlFor={fieldPath} className="text-sm font-medium mb-2">
            {label} <span className="text-red-500">*</span>
          </Label>
          <div
            {...getRootProps()}
            className={cn(
              'border border-dashed rounded-md p-4 text-center cursor-pointer transition-colors flex-1 flex flex-col items-center justify-center',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300',
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Drag & drop an icon, or click to select</p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, SVG, GIF up to {maxSize / 1024 / 1024}MB
            </p>
          </div>

          <Input type="hidden" {...register(fieldPath)} />
        </div>

        {/* Preview Area */}
        <div className="flex flex-col h-[220px]">
          <Label htmlFor={fieldPath} className="text-sm font-medium mb-2">
            Icon Preview
          </Label>
          {iconUrl ? (
            <div className="relative border rounded-md bg-gray-50 flex-1 flex items-center justify-center">
              <div className="relative">
                <Image
                  src={iconUrl || '/placeholder.svg'}
                  alt="Icon preview"
                  className="max-h-[150px] max-w-[150px] object-contain"
                  width={120}
                  height={120}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg?height=80&width=80';
                    (e.target as HTMLImageElement).alt = 'Invalid icon URL';
                  }}
                />
                {iconUrl && (
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-white border shadow-sm hover:bg-gray-100 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-md bg-gray-50 flex-1 flex items-center justify-center text-gray-400">
              <p className="text-sm">No icon selected</p>
            </div>
          )}

          {fileName && (
            <p className="text-xs text-gray-500 mt-2 truncate" title={fileName}>
              {fileName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconUploader;
