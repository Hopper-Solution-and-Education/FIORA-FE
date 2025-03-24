import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  setAccountDeleteDialog,
  setAccountUpdateDialog,
  setRefresh,
  setSelectedAccount,
} from '@/features/home/module/account/slices';
import { deleteAccount } from '@/features/home/module/account/slices/actions';
import { useAppDispatch, useAppSelector } from '@/store';
import React from 'react';
import { toast } from 'sonner';

const DeleteAccountDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accounts, refresh, selectedAccount, accountDeleteDialog } = useAppSelector(
    (state) => state.account,
  );

  const handleDeleteCategory = async () => {
    if (selectedAccount) {
      const response = await dispatch(deleteAccount(selectedAccount.id)).unwrap();
      if (response) {
        toast.success('Account deleted successfully');
        dispatch(setAccountDeleteDialog(false));
        dispatch(setAccountUpdateDialog(false));
        dispatch(setSelectedAccount(null));
        dispatch(setRefresh(!refresh));
      }
    }
  };

  return (
    <Dialog
      open={accountDeleteDialog}
      onOpenChange={(open) => dispatch(setAccountDeleteDialog(open))}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {selectedAccount?.name} account?</p>
        <DialogFooter>
          <Button onClick={() => dispatch(setAccountDeleteDialog(false))}>No</Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCategory}
            disabled={!selectedAccount || accounts.isLoading}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
