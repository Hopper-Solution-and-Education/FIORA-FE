'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import React from 'react';

interface DocumentPreviewProps {
  open: boolean;
  onClose: () => void;
  document: File | null;
  title: string;
  existingUrl?: string;
  existingFileName?: string;
  existingFileType?: string;
  existingFileSize?: number;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  open,
  onClose,
  document,
  title,
  existingUrl,
  existingFileName,
  existingFileType,
  existingFileSize,
}) => {
  const [pdfError, setPdfError] = React.useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileName = document?.name || existingFileName || 'Existing attachment';
  const fileSize = document?.size || existingFileSize || 0;

  const isImage = document
    ? document.type.startsWith('image/')
    : existingFileType
      ? existingFileType.toLowerCase().includes('image')
      : existingUrl
        ? existingUrl.toLowerCase().includes('image') ||
          /\.(jpg|jpeg|png|gif|webp)$/i.test(existingUrl)
        : false;

  const isPdf = document
    ? document.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')
    : existingFileType
      ? existingFileType.toLowerCase().includes('pdf')
      : existingUrl
        ? existingUrl.toLowerCase().includes('pdf') || existingUrl.toLowerCase().endsWith('.pdf')
        : false;

  // Create preview URL for the file or use existing URL
  const previewUrl = document ? URL.createObjectURL(document) : existingUrl || '';

  // Cleanup blob URL on unmount (only for created blob URLs)
  React.useEffect(() => {
    return () => {
      if (document && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [document, previewUrl]);

  if (!document && !existingUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Icons.post className="w-5 h-5 text-primary" />
            {title} Review
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* File Info */}
          <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/20 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
              <Icons.post className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-foreground">{fileName}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {fileSize > 0 ? formatFileSize(fileSize) : 'Existing file'}
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 min-h-0">
            {isImage ? (
              <div className="relative w-full h-96 bg-muted dark:bg-muted/30 rounded-lg overflow-hidden border border-border/50">
                <Image
                  src={previewUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = target.parentElement?.querySelector('.error-fallback');
                    if (errorDiv) {
                      errorDiv.classList.remove('hidden');
                    }
                  }}
                  width={1000}
                  height={1000}
                />
                <div className="error-fallback absolute inset-0 hidden items-center justify-center bg-muted dark:bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <Icons.image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Unable to load image</p>
                  </div>
                </div>
              </div>
            ) : isPdf ? (
              <div className="w-full h-96 bg-muted dark:bg-muted/30 rounded-lg overflow-hidden border border-border/50">
                {!pdfError ? (
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full"
                    title="PDF Preview"
                    onLoad={() => setPdfError(false)}
                    onError={() => setPdfError(true)}
                  />
                ) : null}
                {(pdfError || !previewUrl) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted dark:bg-muted/30">
                    <div className="text-center text-muted-foreground">
                      <Icons.page className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Unable to load PDF preview</p>
                      <p className="text-xs mt-1 mb-2">
                        Your browser may not support PDF preview or the file may be corrupted.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => previewUrl && window.open(previewUrl, '_blank')}
                        disabled={!previewUrl}
                      >
                        <Icons.externalLink className="w-4 h-4 mr-2" />
                        Open PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-muted dark:bg-muted/30 rounded-lg flex items-center justify-center border border-border/50">
                <div className="text-center text-muted-foreground">
                  <Icons.page className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Preview not available for this file type</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-border hover:bg-accent hover:text-accent-foreground"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <Icons.externalLink className="w-4 h-4 mr-2" />
                    Open File
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-accent hover:text-accent-foreground"
            >
              Close
            </Button>
            <Button
              onClick={() => window.open(previewUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              <Icons.externalLink className="w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
