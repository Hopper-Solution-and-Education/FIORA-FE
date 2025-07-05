import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

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

const WalletSettingAttachmentLink: React.FC<WalletSettingAttachmentLinkProps> = ({
  attachment,
  className,
}) => {
  if (!attachment) {
    return (
      <span className={`text-muted-foreground text-sm ${className || ''}`}>No attachment</span>
    );
  }

  const handleDownload = () => {
    window.open(attachment.url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{formatFileSize(attachment.size)}</span>
      <Button variant="ghost" size="sm" onClick={handleDownload} className="h-6 w-6 p-0">
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default WalletSettingAttachmentLink;
