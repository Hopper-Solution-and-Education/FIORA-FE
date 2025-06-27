import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Icons } from '@/components/Icon';

interface WalletDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const WalletDialog = ({ open, onCancel, onConfirm }: WalletDialogProps) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="max-w-md p-6">
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
          <Icons.warning className="text-yellow-500 w-8 h-8" />
        </div>

        <div className="text-center space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Leaving This Page?
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-600 leading-relaxed">
            You haven&apos;t submitted your deposit request yet.
            <br />
            All information you&apos;ve entered will be lost if you proceed.
          </DialogDescription>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 w-full space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ArrowLeftIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-gray-700">
              <span className="font-medium text-blue-600">Stay</span> to continue your deposit
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Icons.check className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-gray-700">
              <span className="font-medium text-green-600">Leave</span> and lose your progress
            </span>
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-row gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12 border-gray-300 hover:bg-gray-50 transition-colors"
          size="lg"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Stay Here
        </Button>

        <Button
          onClick={onConfirm}
          className="flex-1 h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
          size="lg"
        >
          <Icons.check className="w-5 h-5 mr-2" />
          Leave Anyway
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default WalletDialog;
