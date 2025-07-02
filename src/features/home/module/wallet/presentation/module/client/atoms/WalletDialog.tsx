'use client';

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
        <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <Icons.warning className="text-yellow-500 dark:text-yellow-400 w-8 h-8" />
        </div>

        <div className="text-center space-y-3">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Leaving This Page?
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            You haven&apos;t submitted your deposit request yet.
            <br />
            All information you&apos;ve entered will be lost if you proceed.
          </DialogDescription>
        </div>

        <div className="rounded-lg p-4 w-full space-y-3 text-center bg-muted/50 dark:bg-muted/20">
          <div className="flex items-center gap-3 text-xs justify-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <ArrowLeftIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-foreground">
              <span className="font-medium text-blue-600 dark:text-blue-400">Stay</span> to continue
              your deposit
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs justify-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Icons.check className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-foreground">
              <span className="font-medium text-green-600 dark:text-green-400">Leave</span> and lose
              your progress
            </span>
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-row gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12 border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          size="lg"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
        </Button>

        <Button
          onClick={onConfirm}
          className="flex-1 h-12 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-medium transition-colors"
          size="lg"
        >
          <Icons.check className="w-5 h-5 mr-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default WalletDialog;
