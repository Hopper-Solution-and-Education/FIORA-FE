'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { FC } from 'react';

interface DeleteAccountWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteAccountWarningDialog: FC<DeleteAccountWarningDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <GlobalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Account"
      description={
        <>
          This action is irreversible. Once your account is deleted, you will lose access to it and
          your transaction history permanently.
          <br />
          <br />
          <span className="font-medium">Are you sure you want to proceed?</span>
        </>
      }
      variant="danger"
      type="danger"
      isLoading={isLoading}
      className="max-w-md"
      cancelText="Cancel"
      confirmText="Proceed to OTP"
      onCancel={handleClose}
      onConfirm={onConfirm}
    />
  );
};

export default DeleteAccountWarningDialog;
