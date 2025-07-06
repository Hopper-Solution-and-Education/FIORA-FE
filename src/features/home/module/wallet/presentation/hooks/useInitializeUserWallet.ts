/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getWalletsAsyncThunk } from '../../slices/actions';

export const useInitializeUserWallet = () => {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);

  useEffect(() => {
    if (!wallets) {
      dispatch(getWalletsAsyncThunk());
    }
  }, []);
};
