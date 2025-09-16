'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, FileText, HelpCircle, Upload } from 'lucide-react';

interface FileUploadProps {
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  title: string;
  requirements?: string[];
  accept?: string;
  isLoading?: boolean;
  placeholder?: string;
  maxSizeText?: string;
  filePhotoUrl?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFile,
  onFileUpload,
  title,
  requirements = [
    'Document should be in good condition and clearly visible',
    'File size should not exceed 5MB',
  ],
  accept = '.pdf,.jpg,.jpeg,.png',
  isLoading = false,
  placeholder = 'Upload your document',
  maxSizeText = 'Drag and drop or click to browse (JPG, PNG, or PDF, max 5MB)',
  filePhotoUrl,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          {requirements.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>Document Requirements:</p>
                  <ul className="text-xs space-y-1">
                    {requirements.map((requirement, index) => (
                      <li key={index}>• {requirement}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-w-full">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              uploadedFile || filePhotoUrl
                ? 'border-green-300 bg-green-50'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20'
            }`}
          >
            <input
              type="file"
              accept={accept}
              className="hidden"
              id={`file-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}
              onChange={handleFileUpload}
              disabled={isLoading}
            />
            <label
              htmlFor={`file-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}
              className="cursor-pointer"
            >
              {uploadedFile || filePhotoUrl ? (
                <div className="space-y-3">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      File uploaded successfully!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {uploadedFile?.name || filePhotoUrl}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" disabled={isLoading}>
                    Replace File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{placeholder}</p>
                    <p className="text-xs text-muted-foreground mt-1">{maxSizeText}</p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
