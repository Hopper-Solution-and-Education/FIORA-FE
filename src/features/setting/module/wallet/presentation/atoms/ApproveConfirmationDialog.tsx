/* eslint-disable @next/next/no-img-element */
import { LoadingIndicator } from '@/components/common/atoms';
import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useCallback, useRef, useState } from 'react';

interface ApproveConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (attachments?: File[]) => void;
  isUpdating: boolean;
  requestType?: 'Deposit' | 'Withdraw';
}

const ApproveConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  isUpdating,
  requestType = 'Deposit',
}: ApproveConfirmationDialogProps) => {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    onConfirm(requestType === 'Withdraw' && attachment ? [attachment] : undefined);
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Only take the first file

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setAttachment(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload],
  );

  const removeFile = () => {
    setAttachment(null);
  };

  const handleClose = () => {
    // Cleanup object URLs to prevent memory leaks
    if (attachment && attachment.type.startsWith('image/')) {
      URL.revokeObjectURL(URL.createObjectURL(attachment));
    }
    setAttachment(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <GlobalDialog
      open={open}
      onOpenChange={handleClose}
      type="success"
      title={`Approve ${requestType} Request`}
      description={`Are you sure you want to approve this ${requestType.toLowerCase()} request? This action is final and will notify the user immediately.`}
      hideCancel={true}
      hideConfirm={true}
      className="max-w-md"
    >
      {requestType === 'Withdraw' && (
        <div className="w-full space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icons.upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="text-blue-600 dark:text-blue-400 font-medium">Click to Upload</span>{' '}
              or drag and drop (optional)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Max. File size: 5 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Uploaded File */}
          {attachment && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Uploaded file:
              </p>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Display actual image for image files, otherwise show file icon */}
                  {attachment.type.startsWith('image/') ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(attachment)}
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icons.page className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]"
                      title={attachment.name}
                    >
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Progress bar with 100% */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-green-200 dark:bg-green-800 rounded-full">
                      <div className="w-full h-full bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      100%
                    </span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center"
                  >
                    <Icons.trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instruction Text */}
      <div className="w-full mt-4 space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Click</span>
          <Icons.arrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>to stay back</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Or click</span>
          <Icons.check className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>to confirm</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row justify-center gap-3 mt-6">
        <CommonTooltip content="Cancel and go back">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
            className="w-48 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            disabled={isUpdating}
          >
            <Icons.arrowLeft className="w-5 h-5" />
          </Button>
        </CommonTooltip>
        <CommonTooltip content={isUpdating ? 'Processing...' : 'Confirm approval'}>
          <Button
            onClick={handleConfirm}
            disabled={isUpdating}
            type="button"
            className="w-48 h-12 flex items-center justify-center bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isUpdating ? <LoadingIndicator /> : <Icons.check className="w-5 h-5" />}
          </Button>
        </CommonTooltip>
      </div>
    </GlobalDialog>
  );
};

export default ApproveConfirmationDialog;
