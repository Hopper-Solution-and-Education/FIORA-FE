import { setAccountDeleteDialog, setSelectedAccount } from '@/features/home/module/account/slices';
import { fetchAccounts } from '@/features/home/module/account/slices/actions';
import { findAccountById } from '@/features/home/module/account/slices/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export function useUpdateAccount(id: string) {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!accounts.data && !accounts.isLoading) {
      dispatch(fetchAccounts());
    }
  }, [accounts.data, accounts.isLoading, dispatch]);

  const account = useMemo(() => {
    if (!accounts.data) {
      return null;
    }
    return findAccountById(accounts.data, id);
  }, [accounts.data, id]);

  const handleDelete = useCallback(() => {
    if (account && account.children.length > 0) {
      toast.error('Please delete the sub account first!');
      return;
    }

    if (account) {
      dispatch(setSelectedAccount(account));
      dispatch(setAccountDeleteDialog(true));
    }
  }, [account, dispatch]);

  return {
    account,
    isLoading: accounts.isLoading,
    error: accounts.error,
    handleDelete,
  };
}
