/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getPackageFXAsyncThunk } from '../../slices/actions';

export function useInitializePackageFX() {
  const dispatch = useAppDispatch();
  const packageFX = useAppSelector((state) => state.wallet.packageFX);
  const loading = useAppSelector((state) => state.wallet.loading);
  const error = useAppSelector((state) => state.wallet.error);

  useEffect(() => {
    if (!packageFX) {
      dispatch(getPackageFXAsyncThunk());
    }
  }, []);

  return { packageFX, loading, error };
}
