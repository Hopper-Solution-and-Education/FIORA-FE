/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchFrozenAmountAsyncThunk } from '../../slices/actions';

export const useInitialFrozenAmount = () => {
  const dispatch = useAppDispatch();
  const frozenAmount = useAppSelector((state) => state.wallet.frozenAmount);

  useEffect(() => {
    if (!frozenAmount) {
      dispatch(fetchFrozenAmountAsyncThunk());
    }
  }, []);
};
