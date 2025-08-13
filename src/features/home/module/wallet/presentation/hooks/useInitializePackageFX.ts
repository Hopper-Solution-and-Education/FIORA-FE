'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getPackageFXAsyncThunk } from '../../slices/actions';

export function useInitializePackageFX() {
  const dispatch = useAppDispatch();
  const packageFX = useAppSelector((state) => state.wallet.packageFX);

  useEffect(() => {
    if (!packageFX) {
      dispatch(getPackageFXAsyncThunk());
    }
  }, []);
}
