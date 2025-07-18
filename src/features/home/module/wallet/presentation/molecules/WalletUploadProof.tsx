'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { FRONTEND_ATTACHMENT_CONSTANTS } from '../../data/constant';
import { setAttachmentData } from '../../slices';
import WalletProofReview from '../atoms/WalletProofReview';
import { ATTACHMENT_TYPES, AttachmentType } from '../types/attachment.type';

const WalletUploadProof = () => {
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const attachmentData = {
      type: getFileType(file.type),
      size: file.size,
      url: '',
      path: '',
      file,
    };

    dispatch(setAttachmentData(attachmentData));
  };

  const handleRemoveFile = () => {
    dispatch(setAttachmentData(null));
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

  if (attachmentData) {
    const uploadedFileName =
      attachmentData.path?.split('/').pop() || attachmentData.file?.name || 'Unknown file';
    const isImage = attachmentData.type === ATTACHMENT_TYPES.IMAGE;

    return (
      <div className="w-full flex flex-col items-center gap-2 ">
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
                className="h-8 w-8 p-0 hover:bg-green-100"
                title="Change file"
              >
                <Icons.pencil className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-8 w-8 p-0 hover:bg-red-100"
                title="Remove file"
              >
                <Icons.trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex flex-row items-center gap-4 text-green-700 justify-between">
            <div className="flex flex-col min-w-0 items-start flex-1">
              <div className="flex items-center min-w-0 gap-2">
                <Icons.post className="w-4 h-4 flex-shrink-0 text-green-600" />
                <button
                  data-test="wallet-upload-proof-file-name"
                  onClick={() => setShowReviewModal(true)}
                  className="hover:underline cursor-pointer font-semibold truncate max-w-[160px] sm:max-w-[220px] text-left text-green-900"
                  title={uploadedFileName}
                >
                  {uploadedFileName}
                </button>
              </div>
              <span className="block text-xs text-green-600 font-medium pl-6 mt-1">
                {formatFileSize(attachmentData.size)}
              </span>
            </div>
            {isImage && (
              <div
                className="flex justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => setShowReviewModal(true)}
                title="Click to preview"
              >
                <Image
                  src={
                    attachmentData.url ||
                    (attachmentData.file ? URL.createObjectURL(attachmentData.file) : '')
                  }
                  alt={uploadedFileName}
                  className="rounded-lg shadow-md max-h-20 sm:max-h-28 md:max-h-32 w-auto max-w-[90px] sm:max-w-[120px] md:max-w-[160px] object-contain border border-green-200 bg-white transition-all duration-200"
                  style={{ display: 'block', margin: '0 auto' }}
                  width={120}
                  height={80}
                />
              </div>
            )}
          </div>
        </div>

        <Input
          ref={inputRef}
          type="file"
          accept={FRONTEND_ATTACHMENT_CONSTANTS.ACCEPTED_FILE_EXTENSIONS}
          className="hidden"
          onChange={handleFileChange}
        />

        <WalletProofReview
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          attachmentData={attachmentData}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Button variant="outline" className="btn btn-primary w-full" onClick={handleUploadClick}>
        <Icons.upload className="mr-2 h-4 w-4" />
        Upload Payment Proof
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
    </div>
  );
};

export default WalletUploadProof;
