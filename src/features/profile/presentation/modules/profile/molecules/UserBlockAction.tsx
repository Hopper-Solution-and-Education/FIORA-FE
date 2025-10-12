'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';

interface UserBlockActionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'block' | 'unblock';
  userId?: string;
  userName?: string;
  onConfirm?: (userId: string, reason?: string) => Promise<void>;
}

export function UserBlockAction({
  open,
  onOpenChange,
  action,
  userId,
  userName,
  onConfirm,
}: UserBlockActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isBlocking = action === 'block';

  const handleConfirm = async () => {
    if (!userId || !onConfirm) return;

    setIsLoading(true);
    try {
      await onConfirm(userId, undefined);
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[640px] w-full p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-red-50 p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <DialogHeader className="p-0">
            <DialogTitle className="text-center text-2xl font-semibold">
              Block this user from the platform?
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-center max-w-2xl text-sm text-muted-foreground">
            <>
              Are you sure you want to block <strong>{userName || '[User Name]'}</strong>? This
              action will add the user to the blacklist and prevent them from logging in or
              performing any actions on the platform.
            </>
          </DialogDescription>

          <DialogFooter className="w-full mt-4">
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                className="flex-1 py-5 justify-center text-lg rounded-lg"
                onClick={handleClose}
                disabled={isLoading}
                aria-label="Cancel"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <Button
                variant={isBlocking ? 'destructive' : 'default'}
                className="flex-1 py-5 justify-center text-lg rounded-lg"
                onClick={handleConfirm}
                disabled={isLoading}
                aria-label={'Confirm block'}
              >
                {isLoading ? 'Blocking...' : <Check className="h-5 w-5" />}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
