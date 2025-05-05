'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { GlobalDialog } from '../molecules';

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export const DeleteDialog = ({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  confirmText,
  onCancel,
  description,
}: DeleteDialogProps) => {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  const renderLeftButton = () => (
    <Button
      variant="outline"
      type="button"
      onClick={() => (onCancel ? onCancel() : onOpenChange(false))}
      className="w-28 h-10 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
    >
      <Icons.circleArrowLeft className="h-5 w-5" />
    </Button>
  );

  const renderRightButton = () => {
    return (
      <Button
        type="submit"
        onClick={onConfirm}
        className="w-28 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <Icons.check className="h-5 w-5" />
      </Button>
    );
  };

  return (
    <GlobalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Confirmation"
      heading={confirmText}
      description={description || defaultDescription}
      customLeftButton={renderLeftButton()}
      customRightButton={renderRightButton()}
      iconConfirm={<Trash2 />}
      variant="danger"
    />
  );
};
