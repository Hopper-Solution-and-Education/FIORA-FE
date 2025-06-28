import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import React, { useRef, useState } from 'react';
import { FRONTEND_ATTACHMENT_CONSTANTS } from '../../data/constant';
import { setAttachmentData } from '../../slices';
import { ATTACHMENT_TYPES, AttachmentType } from '../types/attachment.type';
import { useAppDispatch, useAppSelector } from '@/store';
import { Icons } from '@/components/Icon';

const WalletUploadProof: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const attachmentData = useAppSelector((state) => state.wallet.attachmentData);

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
      return;
    }

    if (file.size > FRONTEND_ATTACHMENT_CONSTANTS.MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large (max ${FRONTEND_ATTACHMENT_CONSTANTS.MAX_FILE_SIZE_MB}MB).`);
      return;
    }

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
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    dispatch(setAttachmentData(null));
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Hiển thị thông tin file đã upload thành công
  if (attachmentData) {
    const uploadedFileName = attachmentData.path.split('/').pop() || 'Unknown file';

    return (
      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <Icons.checkCircle className="w-4 h-4" />
              <span className="font-medium">Payment Proof Uploaded</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUploadClick}
                disabled={uploading}
                className="h-8 w-8 p-0 hover:bg-green-100"
                title="Change file"
              >
                <Icons.pencil className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={uploading}
                className="h-8 w-8 p-0 hover:bg-red-100"
                title="Remove file"
              >
                <Icons.trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
            <Icons.post className="w-3 h-3" />
            <span>{uploadedFileName}</span>
            <span className="text-xs">({formatFileSize(attachmentData.size)})</span>
          </div>
        </div>

        <Input
          ref={inputRef}
          type="file"
          accept={FRONTEND_ATTACHMENT_CONSTANTS.ACCEPTED_FILE_EXTENSIONS}
          className="hidden"
          onChange={handleFileChange}
        />

        {uploading && (
          <div className="w-full text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-center">
            <Icons.spinner className="inline mr-2 h-3 w-3 animate-spin" />
            Uploading file...
          </div>
        )}
      </div>
    );
  }

  // Hiển thị nút upload khi chưa có file
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Button
        variant="outline"
        className="btn btn-primary w-full"
        onClick={handleUploadClick}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Icons.upload className="mr-2 h-4 w-4" />
            Upload Payment Proof
          </>
        )}
      </Button>

      <Input
        ref={inputRef}
        type="file"
        accept={FRONTEND_ATTACHMENT_CONSTANTS.ACCEPTED_FILE_EXTENSIONS}
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <div className="w-full text-xs text-destructive bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
          {error}
        </div>
      )}

      {uploading && attachmentData && (
        <div className="w-full text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-center">
          <Icons.spinner className="inline mr-2 h-3 w-3 animate-spin" />
          Uploading file...
        </div>
      )}
    </div>
  );
};

export default WalletUploadProof;
