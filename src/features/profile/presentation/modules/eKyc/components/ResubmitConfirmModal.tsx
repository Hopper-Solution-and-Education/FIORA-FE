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
import { ArrowLeft, Check, Info, X } from 'lucide-react';

interface ResubmitConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  type: 'identification' | 'tax' | 'bank' | 'contact';
}

const MODAL_CONTENT = {
  identification: {
    title: 'Re-submit Identification Document',
    description: 'To continue, please re-submit a valid document for identity verification (KYC).',
  },
  tax: {
    title: 'Re-submit Tax Information',
    description: 'To continue, please re-submit valid tax information for verification (KYC).',
  },
  bank: {
    title: 'Re-submit Bank Account',
    description:
      'To continue, please re-submit valid bank account information for verification (KYC).',
  },
  contact: {
    title: 'Re-submit Contact Information',
    description: 'To continue, please re-submit valid contact information for verification (KYC).',
  },
};

const ResubmitConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  type,
}: ResubmitConfirmModalProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!open) {
    return null;
  }

  const content = MODAL_CONTENT[type];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
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
            <div className="p-3 rounded-full mb-4 bg-blue-100 dark:bg-blue-800">
              <Info className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <AlertDialogTitle className="font-semibold text-gray-900 dark:text-white">
              {content.title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        {/* Description */}
        <AlertDialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
          {content.description}
          <br />
          <span className="font-medium">Are you sure you want to proceed?</span>
        </AlertDialogDescription>

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
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 text-sm font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              tabIndex={0}
              aria-label="Confirm re-submit"
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

export default ResubmitConfirmModal;
