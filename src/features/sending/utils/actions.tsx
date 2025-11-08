'use client';

import { httpClient } from '@/config';
import { setSendingFXFormClose } from '@/features/home/module/wallet/slices';
import {
  fetchFrozenAmountAsyncThunk,
  getWalletsAsyncThunk,
} from '@/features/home/module/wallet/slices/actions';
import { fetchPaymentWalletDashboardAsyncThunk } from '@/features/payment-wallet/slices/actions';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import type { OtpState } from '@/shared/types/otp';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchCatalogDataAsync } from '../slices/catalogDataSlice';
import { fetchLimitDataAsync } from '../slices/limitDataSlice';

export const useSendingFXAction = () => {
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((s) => s.wallet);
  const { currency } = useAppSelector((s) => s.settings);
  const { isFetched: isLimitFetched } = useAppSelector((s) => s.limitData);
  const { isFetched: isCatalogFetched } = useAppSelector((s) => s.catalogData);

  const [otpState, setOtpState] = useState<OtpState>('Get');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentBalance = useCallback(() => {
    const paymentWallet = wallets?.find((w: any) => w.type === 'Payment');
    return Number(paymentWallet?.frBalanceActive ?? 0);
  }, [wallets]);

  const checkAmountBalance = useCallback(
    (amount: number, setError?: any, clearErrors?: any): boolean => {
      const balance = getCurrentBalance();
      if (amount > balance) {
        setError?.('amountInput', {
          type: 'max',
          message: `Insufficient balance (${balance.toLocaleString()} ${currency})`,
        });
        return false;
      }
      clearErrors?.('amountInput');
      return true;
    },
    [getCurrentBalance, currency],
  );

  const fetchInitialData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getWalletsAsyncThunk()).unwrap(),
        !isLimitFetched && dispatch(fetchLimitDataAsync()).unwrap(),
        !isCatalogFetched && dispatch(fetchCatalogDataAsync()).unwrap(),
      ]);
    } catch {
      toast.error('Failed to load initial data');
    }
  }, [dispatch, isLimitFetched, isCatalogFetched]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (otpState !== 'Resend' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpState('Get');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpState, countdown]);

  const handleClose = useCallback(
    (reset: () => void) => {
      dispatch(setSendingFXFormClose());
      reset();
      setOtpState('Get');
      setCountdown(0);
    },
    [dispatch],
  );

  const handleGetOtp = useCallback(
    async (data: any, checkAmountBalanceFn: any) => {
      if (!checkAmountBalanceFn(data.amountInput)) {
        toast.error('Please fix the balance error before requesting the OTP.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await httpClient.post<{ status?: number; message?: string }>(
          ApiEndpointEnum.SendingSendOTP,
          { amount: data.amountInput, emailReceiver: data.receiver },
        );

        if (res.status === 200) {
          toast.success('OTP sent successfully. Please check your email.');
          setOtpState('Resend');
          setCountdown(120);
        } else {
          toast.error(res.message || 'Failed to send OTP');
        }
      } catch (err: any) {
        toast.error(err?.message || 'Error while sending OTP');
      } finally {
        setIsLoading(false);
      }
    },
    [checkAmountBalance],
  );

  const handleSubmit = useCallback(
    async (data: any, checkAmountBalanceFn: any, setError: any, reset: any) => {
      if (!checkAmountBalanceFn(data.amountInput)) {
        toast.error('Please fix the balance error before submitting.');
        return;
      }

      if (!data.otp?.trim()) {
        setError('otp', { type: 'required', message: 'OTP is required' });
        toast.error('Please enter the OTP code.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await httpClient.post<{ status: number; message: string }>(
          ApiEndpointEnum.SendingWalletSendFX,
          {
            amount: data.amountInput,
            otp: data.otp,
            emailReceiver: data.receiver,
            categoryId: data.categoryId,
            description: data.description,
            productIds: data.productId ? [data.productId] : [],
          },
        );

        if (res.status === 200) {
          toast.success(res.message || 'FX sent successfully!');
          handleClose(reset);
          await Promise.all([
            dispatch(getWalletsAsyncThunk()),
            dispatch(fetchFrozenAmountAsyncThunk()),
            dispatch(fetchPaymentWalletDashboardAsyncThunk()),
          ]);
        } else {
          toast.error(res.message || 'Failed to send FX');
        }
      } catch (err: any) {
        if (err.message?.includes('Invalid OTP')) {
          setError('otp', { type: 'manual', message: 'Invalid OTP or expired!' });
          toast.error('The OTP code is invalid or has expired!');
        } else {
          toast.error(err.message || 'Error sending FX');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [handleClose],
  );

  return {
    otpState,
    countdown,
    isLoading,
    handleGetOtp,
    handleSubmit,
    handleClose,
    checkAmountBalance,
    getCurrentBalance,
  };
};
