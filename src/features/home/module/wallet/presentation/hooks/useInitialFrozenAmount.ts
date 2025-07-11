/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { fetchFrozenAmountAsyncThunk } from '../../slices/actions';

export const useInitialFrozenAmount = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const frozenAmount = useAppSelector((state) => state.wallet.frozenAmount);

  useEffect(() => {
    if (!frozenAmount && session?.user?.id) {
      dispatch(fetchFrozenAmountAsyncThunk());
    }
  }, [session?.user?.id]);
};
