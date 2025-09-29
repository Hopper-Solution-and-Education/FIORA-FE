'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DocumentPreview from './DocumentPreview';

// Uploaded Document Display Component
interface UploadedDocumentDisplayProps {
  document: File;
  title: string;
  onPreview: () => void;
  onReplace: () => void;
  onRemove: () => void;
  disabled: boolean;
  loading: boolean;
  IconComponent?: LucideIcon;
  requirements: string[];
}

const UploadedDocumentDisplay: React.FC<UploadedDocumentDisplayProps> = ({
  document,
  title,
  onPreview,
  onReplace,
  onRemove,
  disabled,
  loading,
  IconComponent,
  requirements,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = document.type.startsWith('image/');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isImage && document) {
      const url = URL.createObjectURL(document);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setPreviewUrl(null);
  }, [document, isImage]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          {IconComponent ? (
            <IconComponent className="h-5 w-5 text-green-600" />
          ) : (
            <Icons.post className="h-5 w-5 text-green-600" />
          )}
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
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <Icons.checkCircle className="w-4 h-4" />
                <span className="font-medium">Document Uploaded</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {!disabled && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={onReplace}
                      className="h-8 w-8 p-0 hover:bg-green-100"
                      title="Change file"
                      disabled={loading}
                    >
                      <Icons.pencil className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={onRemove}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                      title="Remove file"
                      disabled={loading}
                    >
                      <Icons.trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-row items-center gap-4 text-green-700 justify-between">
              <div className="flex flex-col min-w-0 items-start flex-1">
                <div className="flex items-center min-w-0 gap-2">
                  <Icons.post className="w-4 h-4 flex-shrink-0 text-green-600" />
                  <button
                    onClick={onPreview}
                    className="hover:underline cursor-pointer font-semibold text-left text-green-900"
                    title={document.name}
                    type="button"
                  >
                    {document.name}
                  </button>
                </div>
                <span className="block text-xs text-green-600 font-medium pl-6 mt-1">
                  {formatFileSize(document.size)}
                </span>
              </div>
              {isImage && previewUrl && (
                <div
                  className="flex justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={onPreview}
                  title="Click to preview"
                >
                  <Image
                    src={previewUrl}
                    alt={document.name}
                    className="rounded-lg shadow-md max-h-20 sm:max-h-28 md:max-h-32 w-auto max-w-[90px] sm:max-w-[120px] md:max-w-[160px] object-contain border border-green-200 bg-white transition-all duration-200"
                    style={{ display: 'block', margin: '0 auto' }}
                    width={120}
                    height={80}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Existing Document Display Component
interface ExistingDocumentDisplayProps {
  existingUrl: string;
  existingFileName?: string;
  existingFileType?: string;
  existingFileSize?: number;
  title: string;
  onPreview: () => void;
  onReplace?: () => void;
  disabled: boolean;
  loading: boolean;
  IconComponent?: LucideIcon;
  iconColor: string;
  requirements: string[];
}

const ExistingDocumentDisplay: React.FC<ExistingDocumentDisplayProps> = ({
  existingUrl,
  existingFileName,
  existingFileType,
  existingFileSize,
  title,
  onPreview,
  onReplace,
  disabled,
  loading,
  IconComponent,
  iconColor,
  requirements,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileName = existingFileName || 'Existing attachment';
  const fileSize = existingFileSize || 0;
  const isImage =
    existingFileType?.toLowerCase().startsWith('image/') ||
    existingUrl.toLowerCase().includes('image') ||
    /\.(jpg|jpeg|png|gif|webp)$/i.test(existingUrl);
  const isPdf =
    existingFileType?.toLowerCase().includes('pdf') ||
    existingUrl.toLowerCase().includes('pdf') ||
    existingUrl.toLowerCase().endsWith('.pdf');
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          {IconComponent ? (
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <Icons.post className={`h-5 w-5 ${iconColor}`} />
          )}
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
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <Icons.checkCircle className="w-4 h-4" />
                <span className="font-medium">Document Uploaded</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {!disabled && onReplace && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={onReplace}
                    className="h-8 w-8 p-0 hover:bg-green-100"
                    title="Change file"
                    disabled={loading}
                  >
                    <Icons.pencil className="h-4 w-4 text-green-600" />
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-row items-center gap-4 text-green-700 justify-between">
              <div className="flex flex-col min-w-0 items-start flex-1">
                <div className="flex items-center min-w-0 gap-2">
                  {isPdf ? (
                    <Icons.page className="w-4 h-4 flex-shrink-0 text-red-600" />
                  ) : isImage ? (
                    <Icons.image className="w-4 h-4 flex-shrink-0 text-blue-600" />
                  ) : (
                    <Icons.post className="w-4 h-4 flex-shrink-0 text-green-600" />
                  )}
                  <button
                    onClick={onPreview}
                    className="hover:underline cursor-pointer font-semibold text-left text-green-900"
                    title={fileName}
                    type="button"
                  >
                    {fileName}
                  </button>
                </div>
                <span className="block text-xs text-green-600 font-medium pl-6 mt-1">
                  {fileSize > 0 ? formatFileSize(fileSize) : 'Existing file'}
                </span>
              </div>
              {isImage && (
                <div
                  className="flex justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={onPreview}
                  title="Click to preview"
                >
                  <Image
                    src={existingUrl}
                    alt={fileName}
                    className="rounded-lg shadow-md max-h-20 sm:max-h-28 md:max-h-32 w-auto max-w-[90px] sm:max-w-[120px] md:max-w-[160px] object-contain border border-green-200 bg-white transition-all duration-200"
                    style={{ display: 'block', margin: '0 auto' }}
                    width={120}
                    height={80}
                    onError={(e) => {
                      // Hide the image if it fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty Upload State Component
interface EmptyUploadStateProps {
  title: string;
  finalUploadText: string;
  helperText: string;
  isDragging: boolean;
  loading: boolean;
  disabled: boolean;
  enableDragDrop: boolean;
  onUploadClick: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  IconComponent?: LucideIcon;
  iconColor: string;
  requirements: string[];
  displayError?: string;
}

const EmptyUploadState: React.FC<EmptyUploadStateProps> = ({
  title,
  finalUploadText,
  helperText,
  isDragging,
  loading,
  disabled,
  enableDragDrop,
  onUploadClick,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  IconComponent,
  iconColor,
  requirements,
  displayError,
}) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          {IconComponent ? (
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <Icons.post className={`h-5 w-5 ${iconColor}`} />
          )}
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
              enableDragDrop && !disabled && !loading
                ? 'cursor-pointer border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20'
                : 'border-muted-foreground/25'
            } ${
              isDragging ? 'border-primary bg-primary/5' : ''
            } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={!disabled && !loading ? onUploadClick : undefined}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <div className="space-y-3">
              {loading ? (
                <Icons.spinner className="h-12 w-12 mx-auto text-muted-foreground animate-spin" />
              ) : (
                <Icons.upload className="h-12 w-12 mx-auto text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">{loading ? 'Uploading...' : finalUploadText}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isDragging ? 'Drop file here to upload' : helperText}
                </p>
              </div>
            </div>
          </div>

          {displayError && (
            <div className="w-full text-xs text-destructive bg-red-50 dark:bg-red-900/20 p-2 rounded-md mt-2">
              {displayError}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface DocumentUploadProps {
  /** The uploaded document file */
  document: File | null;
  /** Callback when document is uploaded or removed */
  onDocumentChange: (file: File | null) => void;
  /** Document title/label */
  title: string;
  /** Upload button text */
  uploadText?: string;
  /** Drag and drop helper text */
  helperText?: string;
  /** Icon component to display in header */
  icon?: LucideIcon;
  /** Icon color class */
  iconColor?: string;
  /** Document requirements for tooltip */
  requirements?: string[];
  /** Accepted file types */
  accept?: string;
  /** Maximum file size in MB */
  maxSize?: number;
  /** Whether the upload is disabled */
  disabled?: boolean;
  /** Whether the upload is loading */
  loading?: boolean;
  /** Custom error message */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether drag and drop is enabled */
  enableDragDrop?: boolean;
  /** URL of existing attachment to display */
  existingUrl?: string;
  /** Existing file name */
  existingFileName?: string;
  /** Existing file type */
  existingFileType?: string;
  /** Existing file size */
  existingFileSize?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  document,
  onDocumentChange,
  title,
  uploadText,
  helperText = 'Drag and drop or click to browse (JPG, PNG, or PDF, max 5MB)',
  icon: IconComponent,
  iconColor = 'text-orange-600',
  requirements = [
    'Document should be in good condition and clearly visible',
    'Ensure there is no light glare or shadows on the document',
    'File size should not exceed 5MB',
  ],
  accept = 'image/jpeg,image/jpg,image/png,image/gif,application/pdf',
  maxSize = 5,
  disabled = false,
  loading = false,
  error,
  className,
  enableDragDrop = true,
  existingUrl,
  existingFileName,
  existingFileType,
  existingFileSize,
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayError = error || internalError;
  const finalUploadText = uploadText || `Upload ${title}`;

  const validateFile = useCallback(
    (file: File): string | null => {
      // Validate file type
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      if (!acceptedTypes.includes(file.type)) {
        return 'Invalid file type. Please upload the supported file formats.';
      }

      // Validate file size
      const maxSizeBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `File too large (max ${maxSize}MB).`;
      }

      return null;
    },
    [accept, maxSize],
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) {
        setInternalError(null);
        onDocumentChange(null);
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setInternalError(validationError);
        return;
      }

      setInternalError(null);
      onDocumentChange(file);
    },
    [onDocumentChange, validateFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemoveFile = () => {
    handleFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (enableDragDrop && !disabled && !loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!enableDragDrop || disabled || loading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  // Render uploaded state with new document
  if (document) {
    return (
      <div className={className}>
        <UploadedDocumentDisplay
          document={document}
          title={title}
          onPreview={() => setShowPreviewModal(true)}
          onReplace={handleUploadClick}
          onRemove={handleRemoveFile}
          disabled={disabled}
          loading={loading}
          IconComponent={IconComponent}
          requirements={requirements}
        />

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={loading || disabled}
        />

        <DocumentPreview
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={document}
          title={title}
          existingUrl={existingUrl}
        />
      </div>
    );
  }

  // Render existing document state
  if (existingUrl) {
    return (
      <div className={className}>
        <ExistingDocumentDisplay
          existingUrl={existingUrl}
          existingFileName={existingFileName}
          existingFileType={existingFileType}
          existingFileSize={existingFileSize}
          title={title}
          onPreview={() => setShowPreviewModal(true)}
          onReplace={!disabled ? handleUploadClick : undefined}
          disabled={disabled}
          loading={loading}
          IconComponent={IconComponent}
          iconColor={iconColor}
          requirements={requirements}
        />

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={loading || disabled}
        />

        <DocumentPreview
          open={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={document}
          title={title}
          existingUrl={existingUrl}
          existingFileName={existingFileName}
          existingFileType={existingFileType}
          existingFileSize={existingFileSize}
        />
      </div>
    );
  }

  // Render empty upload state
  return (
    <div className={className}>
      <EmptyUploadState
        title={title}
        finalUploadText={finalUploadText}
        helperText={helperText}
        isDragging={isDragging}
        loading={loading}
        disabled={disabled}
        enableDragDrop={enableDragDrop}
        onUploadClick={handleUploadClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        IconComponent={IconComponent}
        iconColor={iconColor}
        requirements={requirements}
        displayError={displayError || undefined}
      />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
        disabled={loading || disabled}
      />

      <DocumentPreview
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={document}
        title={title}
        existingUrl={existingUrl}
        existingFileName={existingFileName}
        existingFileType={existingFileType}
        existingFileSize={existingFileSize}
      />
    </div>
  );
};

export default DocumentUpload;
