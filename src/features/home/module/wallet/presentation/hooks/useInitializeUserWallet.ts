'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getWalletsAsyncThunk } from '../../slices/actions';

export const useInitializeUserWallet = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);

  useEffect(() => {
    if (!wallets && session?.user?.id) {
      dispatch(getWalletsAsyncThunk());
    }
  }, [session?.user?.id]);
};
