import { LoadingIndicator } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    if (requestType === 'Withdraw' && !selectedFile) {
      return; // Don't allow confirm without selected file for withdraw
    }
    onConfirm(requestType === 'Withdraw' && selectedFile ? [selectedFile] : undefined);
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter((file) => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...newFiles]);
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

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    // Cleanup object URLs to prevent memory leaks
    attachments.forEach((file) => {
      if (file.type.startsWith('image/')) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    });
    setAttachments([]);
    setSelectedFile(null);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-muted shadow-lg">
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Icons.check className="text-green-600 dark:text-green-400 w-8 h-8" />
          </div>

          <div className="text-center space-y-3 w-full">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Approve {requestType} Request
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to approve this {requestType.toLowerCase()} request?
              <br />
              This action is final and will notify the user immediately.
            </DialogDescription>
          </div>

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
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Click to Upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Max. File size: 5 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select one file to confirm:
                  </p>
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedFile === file
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedFile === file
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {selectedFile === file && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>

                        {/* Display actual image for image files, otherwise show file icon */}
                        {file.type.startsWith('image/') ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Icons.page className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                            if (selectedFile === file) {
                              setSelectedFile(null);
                            }
                          }}
                          className="w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center"
                        >
                          <Icons.trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
        </div>
        <DialogFooter className="flex flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
            className="flex-1 h-12 border-border hover:bg-accent hover:text-accent-foreground"
            size="lg"
            disabled={isUpdating}
          >
            <Icons.arrowLeft className="w-5 h-5 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isUpdating || (requestType === 'Withdraw' && !selectedFile)}
            type="button"
            className="flex-1 flex justify-center h-12 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium transition-colors"
            size="lg"
          >
            {isUpdating ? <LoadingIndicator /> : <Icons.check className="w-5 h-5 mr-2" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveConfirmationDialog;
