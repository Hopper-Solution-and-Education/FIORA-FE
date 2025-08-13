'use client';

import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { File, FileImage, Upload, Video, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export interface FileUploadConfig {
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  showFileList?: boolean;
  showFileCounter?: boolean;
  showFileSize?: boolean;
  allowMultiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface FileUploadProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  required?: boolean;
  config?: FileUploadConfig;
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
}

const FileUpload = ({
  form,
  name,
  label = 'Upload Files',
  required = false,
  config = {},
  onFileSelect,
  onFileRemove,
}: FileUploadProps) => {
  const {
    maxFiles = 5,
    maxFileSize = 2 * 1024 * 1024, // 2MB default
    acceptedTypes = ['image/*', 'video/*'],
    showFileList = true,
    showFileCounter = true,
    showFileSize = true,
    allowMultiple = true,
    disabled = false,
    className = '',
  } = config;

  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const currentFiles = form.getValues(name) || [];
      const newFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file type
        const isAcceptedType = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            const baseType = type.replace('/*', '');
            return file.type.startsWith(baseType);
          }
          return file.type === type;
        });

        if (!isAcceptedType) {
          toast.error('Invalid file type', {
            description: `Please upload files of the following types: ${acceptedTypes.join(', ')}`,
          });
          continue;
        }

        // Check file size
        if (file.size > maxFileSize) {
          const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
          toast.error('File too large', {
            description: `${file.name} is larger than ${maxSizeMB}MB. Please choose a smaller file.`,
          });
          continue;
        }

        newFiles.push(file);
      }

      // Check total number of files
      if (currentFiles.length + newFiles.length > maxFiles) {
        toast.error('Too many files', {
          description: `You can upload a maximum of ${maxFiles} files.`,
        });
        return;
      }

      const updatedFiles = [...currentFiles, ...newFiles];
      form.setValue(name, updatedFiles);
      onFileSelect?.(newFiles);
    },
    [form, name, acceptedTypes, maxFileSize, maxFiles, onFileSelect],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const currentFiles = form.getValues(name) || [];
      const updatedFiles = currentFiles.filter((_: File, i: number) => i !== index);
      form.setValue(name, updatedFiles);
      onFileRemove?.(index);
    },
    [form, name, onFileRemove],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedTypesText = () => {
    return acceptedTypes
      .map((type) => {
        if (type.endsWith('/*')) {
          return type.replace('/*', ' files');
        }
        return type;
      })
      .join(', ');
  };

  const files = form.watch(name) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={`mb-2 ${className}`}>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {showFileCounter && (
                <span className="text-xs text-muted-foreground">
                  {files.length}/{maxFiles} files
                </span>
              )}
            </div>

            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = allowMultiple;
                input.accept = acceptedTypes.join(',');
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  handleFileSelect(target.files);
                };
                input.click();
              }}
            >
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-sm font-medium">Attachment</div>
                <p className="text-xs text-gray-500">
                  Accepts {getAcceptedTypesText()} up to {(maxFileSize / (1024 * 1024)).toFixed(1)}
                  MB each
                  {maxFiles > 1 && ` (max ${maxFiles} files)`}
                </p>
              </div>
            </div>

            {/* File List */}
            {showFileList && files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                <div className="space-y-2">
                  {files.map((file: File, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          {showFileSize && (
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUpload;
