import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import React, { useRef, useState } from 'react';
import { FRONTEND_ATTACHMENT_CONSTANTS } from '../../data/constant';
import { setAttachmentData } from '../../slices';
import { ATTACHMENT_TYPES, AttachmentType } from '../types/attachment.type';
import { useAppDispatch } from '@/store';

const WalletUploadProof: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const getFileType = (fileType: string): AttachmentType => {
    if (fileType.startsWith('image/')) {
      return ATTACHMENT_TYPES.IMAGE;
    }
    if (fileType === 'application/pdf') {
      return ATTACHMENT_TYPES.PDF;
    }
    return ATTACHMENT_TYPES.DEPOSIT_PROOF;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!FRONTEND_ATTACHMENT_CONSTANTS.ACCEPTED_FILE_TYPES.includes(file.type as any)) {
      setError(
        `Invalid file type. Please upload ${FRONTEND_ATTACHMENT_CONSTANTS.SUPPORTED_FORMATS} files.`,
      );
      setFileName(null);
      dispatch(setAttachmentData(null));
      return;
    }

    if (file.size > FRONTEND_ATTACHMENT_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large (max ${FRONTEND_ATTACHMENT_CONSTANTS.MAX_FILE_SIZE_MB}MB).`);
      setFileName(null);
      dispatch(setAttachmentData(null));
      return;
    }

    setFileName(file.name);
    setError(null);
    setUploading(true);

    try {
      const url = await uploadToFirebase({
        file,
        path: FRONTEND_ATTACHMENT_CONSTANTS.UPLOAD_PATH,
        fileName: file.name.replace(/\.[^/.]+$/, ''),
      });

      const attachmentData = {
        type: getFileType(file.type),
        size: file.size,
        url: url,
        path: `${FRONTEND_ATTACHMENT_CONSTANTS.UPLOAD_PATH}/${file.name}`,
      };

      dispatch(setAttachmentData(attachmentData));
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
      dispatch(setAttachmentData(null));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Button
        variant="outline"
        className="btn btn-primary w-full"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Payment Proof'}
      </Button>

      <Input
        ref={inputRef}
        type="file"
        accept={FRONTEND_ATTACHMENT_CONSTANTS.ACCEPTED_FILE_EXTENSIONS}
        className="hidden"
        onChange={handleFileChange}
      />
      {fileName && <div className="text-xs text-muted-foreground">Selected: {fileName}</div>}
      {error && <div className="text-xs text-destructive">{error}</div>}
      {uploading && <div className="text-xs text-muted-foreground">Uploading...</div>}
    </div>
  );
};

export default WalletUploadProof;
