import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import WalletAttachmentPreviewModal from './WalletAttachmentPreviewModal';

interface WalletSettingAttachmentLinkProps {
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
  className?: string;
}

const SUPPORTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png'];

const WalletSettingAttachmentLink = ({
  attachment,
  className,
}: WalletSettingAttachmentLinkProps) => {
  const [open, setOpen] = useState(false);

  if (!attachment) {
    return <span className={cn('text-muted-foreground text-sm', className)}>No attachment</span>;
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
        {isImage(attachment) ? (
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
                src={attachment.url}
                alt="attachment"
                width={44}
                height={44}
                className="object-cover w-[44px] h-[44px] rounded-[12px] bg-background transition-all hover:border-blue-500 hover:border"
              />
            </div>
          </Button>
        ) : isPDF(attachment) ? (
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
      </div>

      <WalletAttachmentPreviewModal
        open={open}
        onOpenChange={setOpen}
        attachment={attachment}
        isImage={isImage(attachment)}
        isPDF={isPDF(attachment)}
        getFileName={getFileName}
        formatFileSize={formatFileSize}
      />
    </>
  );
};

export default WalletSettingAttachmentLink;
