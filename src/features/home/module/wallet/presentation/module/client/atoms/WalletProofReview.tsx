'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icon';
import { AttachmentType } from '../../../types/attachment.type';
import Image from 'next/image';

interface WalletProofReviewProps {
  open: boolean;
  onClose: () => void;
  attachmentData: {
    type: AttachmentType;
    size: number;
    url: string;
    path: string;
    file?: File;
  } | null;
}

const WalletProofReview: React.FC<WalletProofReviewProps> = ({ open, onClose, attachmentData }) => {
  if (!attachmentData) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileName =
    attachmentData.path?.split('/').pop() || attachmentData.file?.name || 'Unknown file';
  const isImage = attachmentData.type === 'IMAGE';
  let previewUrl = attachmentData.url;
  if (!previewUrl && isImage && attachmentData.file) {
    previewUrl = URL.createObjectURL(attachmentData.file);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Icons.post className="w-5 h-5 text-primary" />
            Payment Proof Review
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
              {formatFileSize(attachmentData.size)}
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 min-h-0">
            {isImage ? (
              <div className="relative w-full h-96 bg-muted dark:bg-muted/30 rounded-lg overflow-hidden border border-border/50">
                <Image
                  src={previewUrl}
                  alt="Payment Proof"
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
                <div className="error-fallback hidden absolute inset-0 flex items-center justify-center bg-muted dark:bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <Icons.image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Unable to load image</p>
                  </div>
                </div>
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
                    onClick={() => previewUrl && window.open(previewUrl, '_blank')}
                    disabled={!previewUrl}
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
              onClick={() => previewUrl && window.open(previewUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              disabled={!previewUrl}
            >
              <Icons.externalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletProofReview;
