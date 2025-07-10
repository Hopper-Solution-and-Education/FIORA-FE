import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface WalletAttachmentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachment: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
  isImage: boolean;
  isPDF: boolean;
  getFileName: (path: string) => string;
  formatFileSize: (bytes: number) => string;
}

const WalletAttachmentPreviewModal = ({
  open,
  onOpenChange,
  attachment,
  isImage,
  isPDF,
  getFileName,
  formatFileSize,
}: WalletAttachmentPreviewModalProps) => {
  if (!isImage && !isPDF) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-4xl w-full p-0 rounded-2xl overflow-hidden',
          'bg-background/95 backdrop-blur-md border-border shadow-2xl',
          'flex flex-col items-center justify-center',
        )}
      >
        <div className="flex items-center justify-between w-full px-10 pt-8 pb-3">
          <DialogTitle className="truncate text-xl font-semibold">
            {getFileName(attachment.path)}
          </DialogTitle>
        </div>
        <div className="px-10 text-sm text-muted-foreground/60 mb-3 w-full text-left">
          {formatFileSize(attachment.size)} • {attachment.type?.toUpperCase()}
        </div>
        <div className="flex w-full max-h-[70vh] justify-center items-center px-6 pb-6">
          <div
            className={cn(
              'relative rounded-2xl overflow-hidden max-w-[90%] max-h-[60vh] bg-background border border-border shadow-lg',
              isPDF ? 'w-full h-[60vh]' : '',
            )}
          >
            {isImage && (
              <Image
                src={attachment.url}
                alt={getFileName(attachment.path)}
                width={800}
                height={600}
                className={cn(
                  'max-h-[60vh] w-auto object-contain transition-transform duration-300',
                  open ? 'scale-100' : 'scale-95',
                )}
                priority
              />
            )}
            {isPDF && (
              <iframe
                src={attachment.url}
                title={getFileName(attachment.path)}
                className="w-full h-full rounded-2xl"
                frameBorder={0}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletAttachmentPreviewModal;
