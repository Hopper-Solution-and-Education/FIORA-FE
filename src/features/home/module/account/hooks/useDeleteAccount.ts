import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Account } from '@/features/home/module/account/slices/types';
import { deleteAccount } from '@/features/home/module/account/slices/actions';
import {
  setAccountDeleteDialog,
  setAccountUpdateDialog,
  setSelectedAccount,
  setRefresh,
} from '@/features/home/module/account/slices';

export function useDeleteAccount() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedAccount, accountDeleteDialog, refresh } = useAppSelector(
    (state) => state.account,
  );

  const [isDeleting, setIsDeleting] = useState(false);

  // Reset local state when dialog opens/closes
  useEffect(() => {
    if (accountDeleteDialog) {
      setIsDeleting(false);
    }
  }, [accountDeleteDialog]);

  // Handle delete action
  const handleDeleteAccount = useCallback(async () => {
    if (!selectedAccount) return;

    try {
      setIsDeleting(true);
      const response = await dispatch(deleteAccount(selectedAccount.id)).unwrap();

      if (response) {
        toast.success('You have delete Account successfully!');
        dispatch(setAccountDeleteDialog(false));
        dispatch(setAccountUpdateDialog(false));
        dispatch(setSelectedAccount(null));
        dispatch(setRefresh(!refresh));
        router.push('/account');
      }
    } catch (error: any) {
      // Handle errors
      console.log(error);
      dispatch(setAccountDeleteDialog(false));
    } finally {
      setIsDeleting(false);
      setAccountDeleteDialog(false);
    }
  }, [dispatch, router, selectedAccount, refresh]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    dispatch(setAccountDeleteDialog(false));
  }, [dispatch]);

  // Open dialog with a specific account
  const openDeleteDialog = useCallback(
    (account: Account) => {
      dispatch(setSelectedAccount(account));
      dispatch(setAccountDeleteDialog(true));
    },
    [dispatch],
  );

  return {
    accountDeleteDialog,
    selectedAccount,
    isDeleting,
    handleDeleteAccount,
    handleClose,
    openDeleteDialog,
  };
}
