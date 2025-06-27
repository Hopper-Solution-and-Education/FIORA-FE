'use client';

import { Progress } from '@/components/ui/progress';
import { File, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FAQ_IMPORT_CONSTANTS } from '../../constants';

interface FileUploadZoneProps {
  isLoading?: boolean;
  onFileSelect: (file: File) => void;
}

const FileUploadZone = ({ isLoading = false, onFileSelect }: FileUploadZoneProps) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      [FAQ_IMPORT_CONSTANTS.ALLOWED_TYPES.XLSX]: ['.xlsx'],
      [FAQ_IMPORT_CONSTANTS.ALLOWED_TYPES.CSV]: ['.csv'],
    },
    maxSize: FAQ_IMPORT_CONSTANTS.MAX_FILE_SIZE,
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-10 text-center transition-colors
          ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive
                ? 'Drop the file here'
                : isLoading
                  ? 'Processing...'
                  : 'Drag and drop your file here'}
            </p>
            {!isLoading && <p className="text-sm text-gray-500 mt-1">or click to browse files</p>}
          </div>
          <p className="text-xs text-gray-500">
            Accepts CSV or Excel files (.csv, .xlsx) up to 2MB
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading and validating...</span>
          </div>
          <Progress value={75} className="w-full h-2" />
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
