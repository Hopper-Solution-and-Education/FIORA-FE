'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteAccount } from '@/features/home/module/account/hooks/useDeleteAccount';
import { useAppSelector } from '@/store';
import React, { useEffect } from 'react';

const DeleteAccountDialog: React.FC = () => {
  const { accountDeleteDialog, selectedAccount, isDeleting, handleDeleteAccount, handleClose } =
    useDeleteAccount();
  const { accounts } = useAppSelector((state) => state.account);

  useEffect(() => {
    console.log('accountDeleteDialog: ', accountDeleteDialog);
    console.log('selectedAccount: ', selectedAccount);
  }, [selectedAccount, accountDeleteDialog]);

  return (
    <Dialog open={accountDeleteDialog} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {selectedAccount?.name} account?</p>
        <DialogFooter>
          <Button onClick={handleClose}>No</Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!selectedAccount || accounts.isLoading || isDeleting}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
