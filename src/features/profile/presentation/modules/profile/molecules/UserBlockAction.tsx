'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
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

  const title = isBlocking ? 'Block this user from the platform?' : 'Unblock this user?';
  const description = isBlocking ? (
    <>
      Are you sure you want to block <strong>{userName || '[User Name]'}</strong>? <br />
      This action will add the user to the blacklist and prevent them from logging in or performing
      any actions on the platform.
    </>
  ) : (
    <>
      Are you sure you want to unblock <strong>{userName || '[User Name]'}</strong>? <br />
      This will allow the user to access the platform again.
    </>
  );

  return (
    <GlobalDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="danger"
      title={title}
      type="danger"
      description={description}
      className="sm:max-w-lg w-full p-8"
      renderContent={() => (
        <div className=" text-md text-gray-500 dark:text-gray-400 text-center">
          Click <ArrowLeft className="inline h-3 w-3 mx-0.5 text-blue-500" /> to stay back
          <br />
          Or click <Check className="inline h-3 w-3 mx-0.5 text-green-500" /> to confirm
        </div>
      )}
      footer={
        <div className="w-full mt-4">
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
              aria-label={`Confirm ${action}`}
            >
              {isLoading ? (
                `${action === 'block' ? 'Blocking...' : 'Unblocking...'}`
              ) : (
                <Check className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      }
      hideCancel
      hideConfirm
      isLoading={isLoading}
    />
  );
}
