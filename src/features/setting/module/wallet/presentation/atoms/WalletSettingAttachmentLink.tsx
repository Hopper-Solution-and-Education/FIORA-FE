import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { FXRequestType } from '../../domain';
import UpdateWithdrawReceiptDialog from './UpdateWithdrawReceiptDialog';
import WalletAttachmentPreviewModal from './WalletAttachmentPreviewModal';

interface WalletSettingAttachmentLinkProps {
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
  requestType?: FXRequestType;
  requestCode?: string;
  requestId?: string;
  className?: string;
}

const SUPPORTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png'];

const WalletSettingAttachmentLink = ({
  attachment,
  requestType,
  requestCode,
  requestId,
  className,
}: WalletSettingAttachmentLinkProps) => {
  const [open, setOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isWithdrawRequest = requestType === FXRequestType.Withdraw;

  const handleUploadReceipt = async (file: File) => {
    setIsUpdating(true);
    try {
      // Mock implementation - in real app, this would call an API
      console.log('Uploading receipt for request:', requestId, file);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload
      setUploadDialogOpen(false);
      // Show success toast
      alert('Receipt uploaded successfully!');
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Failed to upload receipt');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!attachment && !isWithdrawRequest) {
    return <span className={cn('text-muted-foreground text-sm', className)}>No attachment</span>;
  }

  if (!attachment && isWithdrawRequest) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setUploadDialogOpen(true)}
          className="h-8 px-3 text-xs"
        >
          <Icons.upload className="w-3 h-3 mr-1" />
          Upload Receipt
        </Button>
        <UpdateWithdrawReceiptDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onConfirm={handleUploadReceipt}
          isUpdating={isUpdating}
          requestCode={requestCode || ''}
        />
      </>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileName = (path: string) => {
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  const isPDF = (attachment: { type?: string; path?: string }) => {
    if (attachment.type === 'application/pdf') return true;
    if (attachment.path) {
      const ext = attachment.path.split('.').pop()?.toLowerCase();
      return ext === 'pdf';
    }
    return false;
  };

  const isImage = (attachment: { type?: string; path?: string }) => {
    if (attachment.type && attachment.type.startsWith('image/')) {
      const ext = attachment.type.split('/').pop()?.toLowerCase();
      return !!ext && SUPPORTED_IMAGE_TYPES.includes(ext);
    }

    if (attachment.path) {
      const ext = attachment.path.split('.').pop()?.toLowerCase();
      return !!ext && SUPPORTED_IMAGE_TYPES.includes(ext);
    }
    return false;
  };

  return (
    <>
      <div className={cn('flex items-center justify-center gap-2', className)}>
        {isImage(attachment!) ? (
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'flex justify-center items-center p-0 overflow-hidden transition-all',
              'min-h-[44px] min-w-[44px] max-w-[64px] max-h-[44px]',
              'rounded-[12px] border-border bg-background shadow-sm',
              'hover:shadow-lg hover:border-primary hover:scale-105 focus:outline-none',
            )}
            onClick={() => setOpen(true)}
            tabIndex={0}
            aria-label="Preview attachment"
          >
            <div className="flex items-center justify-center w-[44px] h-[44px]">
              <Image
                src={attachment!.url}
                alt="attachment"
                width={44}
                height={44}
                className="object-cover w-[44px] h-[44px] rounded-[12px] bg-background transition-all hover:border-blue-500 hover:border"
              />
            </div>
          </Button>
        ) : isPDF(attachment!) ? (
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'flex justify-center items-center p-0 overflow-hidden transition-all',
              'min-h-[44px] min-w-[44px] max-w-[64px] max-h-[44px]',
              'rounded-[12px] border-border bg-background shadow-sm',
              'hover:shadow-lg hover:border-primary hover:scale-105 focus:outline-none',
            )}
            onClick={() => setOpen(true)}
            tabIndex={0}
            aria-label="Preview PDF"
          >
            <Icons.pdf style={{ width: '32px', height: '32px' }} />
          </Button>
        ) : null}

        {isWithdrawRequest && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            title="Update receipt"
          >
            <Icons.upload className="w-4 h-4" />
          </Button>
        )}
      </div>

      <WalletAttachmentPreviewModal
        open={open}
        onOpenChange={setOpen}
        attachment={attachment!}
        isImage={isImage(attachment!)}
        isPDF={isPDF(attachment!)}
        getFileName={getFileName}
        formatFileSize={formatFileSize}
      />

      <UpdateWithdrawReceiptDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onConfirm={handleUploadReceipt}
        isUpdating={isUpdating}
        currentImageUrl={attachment?.url}
        requestCode={requestCode || ''}
      />
    </>
  );
};

export default WalletSettingAttachmentLink;
