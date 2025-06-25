import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getWalletsAsyncThunk } from '../../slices/actions';

export const useInitializeUserWallet = () => {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const loading = useAppSelector((state) => state.wallet.loading);
  const error = useAppSelector((state) => state.wallet.error);

  useEffect(() => {
    if (!wallets || wallets.length === 0) {
      dispatch(getWalletsAsyncThunk());
    }
  }, [dispatch, wallets]);

  return { wallets, loading, error };
};
