'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ArrowLeft, Check, Info, X } from 'lucide-react';
import { useState } from 'react';

interface VerifyConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'approve' | 'reject';
  onConfirm: (remarks?: string) => void;
  isLoading?: boolean;
}

const VerifyConfirmModal = ({
  open,
  onOpenChange,
  type,
  onConfirm,
  isLoading = false,
}: VerifyConfirmModalProps) => {
  const [remarks, setRemarks] = useState('');

  const handleConfirm = () => {
    onConfirm(type === 'reject' ? remarks : undefined);
  };

  const handleClose = () => {
    setRemarks('');
    onOpenChange(false);
  };

  if (!open) {
    return null;
  }

  const isApprove = type === 'approve';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Close Button */}
        <div className="absolute top-0 right-0 pt-2 pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Header */}
        <AlertDialogHeader className="relative">
          <div className="flex flex-col items-center text-center">
            <div
              className={`p-3 rounded-full mb-4 ${
                isApprove ? 'bg-blue-100 dark:bg-blue-800' : 'bg-red-100 dark:bg-red-800'
              }`}
            >
              {isApprove ? (
                <Info className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
              )}
            </div>
            <AlertDialogTitle className=" font-semibold text-gray-900 dark:text-white">
              {isApprove
                ? 'Are you sure you want to approve this KYC request?'
                : 'Reject KYC Request'}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {/* Description */}
        <AlertDialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
          {isApprove ? (
            <>
              This action will mark the KYC status as &quot;Approved&quot;, and the user will be
              considered verified.
              <br />
              Please ensure all submitted information and documents have been carefully reviewed.
            </>
          ) : (
            <>
              This action will mark the KYC status as &quot;Rejected&quot;. The user will be
              notified and may be required to re-submit their documents.
              <br />
              You can optionally provide a reason for the rejection.
            </>
          )}
        </AlertDialogDescription>

        {/* Remarks for Reject */}
        {!isApprove && (
          <div className="mt-4 space-y-2">
            <Label
              htmlFor="remarks"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Remarks
            </Label>
            <Textarea
              id="remarks"
              placeholder="Enter the reason for rejection"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              disabled={isLoading}
              className="resize-none text-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        )}

        {/* Instructions */}
        <AlertDialogDescription className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Click <ArrowLeft className="inline h-3 w-3 mx-0.5 text-gray-500" /> to stay back
          <br />
          Or click <Check className="inline h-3 w-3 mx-0.5 text-green-500" /> to confirm
        </AlertDialogDescription>

        {/* Footer */}
        <AlertDialogFooter className="mt-6 grid grid-cols-2 gap-3">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 text-sm font-semibold rounded-md border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400"
              tabIndex={0}
              aria-label="Cancel and stay back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 text-sm font-semibold rounded-md text-white focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${
                isApprove
                  ? 'bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-300'
                  : 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-400 dark:focus-visible:ring-red-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              tabIndex={0}
              aria-label={isApprove ? 'Confirm approval' : 'Confirm rejection'}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Processing...</span>
                </div>
              ) : (
                <Check className="h-6 w-6" />
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyConfirmModal;
