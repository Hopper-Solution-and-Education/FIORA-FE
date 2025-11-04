'use client';

import { Loading } from '@/components/common/atoms';
import SendOtpButton from '@/components/common/atoms/SendOtpButton';
import { TextareaField } from '@/components/common/forms';
import InputOtp from '@/components/common/forms/input/InputOtp';
import { MetricCard } from '@/components/common/metric';
import { GlobalDialog } from '@/components/common/molecules';
import { Card, CardContent } from '@/components/ui/card';
import { httpClient } from '@/config';
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import ProductSelectField from '@/features/home/module/transaction/components/ProductSelectField';
import ReceiverSelectField from '@/features/home/module/transaction/components/ReceiverSelectField';
import { getWalletsAsyncThunk } from '@/features/home/module/wallet/slices/actions';
import { setSendingFXFormClose } from '@/features/home/module/wallet/slices/index';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import type { OtpState, WalletSendingOverview } from '@/shared/types/otp';
import { useAppDispatch, useAppSelector } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import AmountSelect from '../../components/AmountSelect';
import { fetchCatalogDataAsync } from '../../slices/catalogDataSlice';
import { fetchLimitDataAsync } from '../../slices/limitDataSlice';

const useLimitSelector = () => {
  const { limit, isLoading, isFetched } = useAppSelector((s: any) => s.limitData);
  return { limit, isLoading, isFetched };
};

const useCatalogSelector = () => {
  const { catalog, isLoading, isFetched } = useAppSelector((s: any) => s.catalogData);
  return {
    categories: catalog?.categories,
    products: catalog?.products,
    isLoading,
    isFetched,
  };
};

const sendingSchema = z.object({
  receiver: z
    .string({ required_error: 'Receiver email is required' })
    .email('Invalid email format'),
  amountInput: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(0.01, 'Amount must be greater than 0'),
  categoryId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  description: z.string().max(150, 'Description must be at most 150 characters').optional(),
  otp: z.string().optional(),
});

type SendingInputs = z.infer<typeof sendingSchema>;

type OverviewSendingResponseType = {
  data: WalletSendingOverview;
};

const initialUIState = {
  otpState: 'Get' as OtpState,
  countdown: 0,
};

function SendingFXForm() {
  const dispatch = useAppDispatch();
  const { isShowSendingFXForm, wallets } = useAppSelector((s) => s.wallet);
  const { currency } = useAppSelector((state) => state.settings);

  const { limit, isLoading: isLimitLoading, isFetched: isLimitFetched } = useLimitSelector();

  const {
    categories,
    products,
    isLoading: isCatalogLoading,
    isFetched: isCatalogFetched,
  } = useCatalogSelector();

  const [otpState, setOtpState] = useState<OtpState>(initialUIState.otpState);
  const [countdown, setCountdown] = useState(initialUIState.countdown);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const { isLoading: isOverviewLoading, mutate: refetchOverview } =
    useDataFetch<OverviewSendingResponseType>({
      endpoint: ApiEndpointEnum.walletWithdraw,
      method: 'GET',
      refreshInterval: 1000 * 60 * 5,
    });

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<SendingInputs>({
    resolver: zodResolver(sendingSchema),
    defaultValues: {
      receiver: '',
      categoryId: null,
      productId: null,
      amountInput: 0,
      description: '',
      otp: '',
    },
    mode: 'onChange',
  });

  const getCurrentBalance = useCallback((): number => {
    if (!wallets) return 0;

    const paymentWallet = wallets.find((w: any) => w.type === 'Payment');
    return Number(paymentWallet?.frBalanceActive ?? 0);
  }, [wallets]);

  const checkAmountBalance = useCallback(
    (amount: number): boolean => {
      const currentBalance = getCurrentBalance();
      if (amount > currentBalance) {
        setError('amountInput', {
          type: 'max',
          message: `Insufficient balance (${currentBalance.toLocaleString()} ${currency})`,
        });
        return false;
      }
      clearErrors('amountInput');
      return true;
    },
    [getCurrentBalance, currency, setError, clearErrors],
  );

  const fetchData = useCallback(async () => {
    const fetchTasks = [];
    fetchTasks.push(dispatch(getWalletsAsyncThunk()).unwrap());

    if (!isLimitFetched) {
      fetchTasks.push(dispatch(fetchLimitDataAsync()));
    }
    if (!isCatalogFetched) {
      fetchTasks.push(dispatch(fetchCatalogDataAsync()));
    }

    try {
      await Promise.all(fetchTasks);
    } catch {
      toast.error('Failed to load initial data');
    }
  }, [dispatch, isLimitFetched, isCatalogFetched]);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleClose = useCallback(() => {
    dispatch(setSendingFXFormClose());
    reset();
    setOtpState(initialUIState.otpState);
    setCountdown(initialUIState.countdown);
  }, [dispatch, reset]);

  const handleGetOtp = handleSubmit(async (data) => {
    if (!checkAmountBalance(data.amountInput)) {
      toast.error('Please fix the balance error before requesting the OTP.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = (await httpClient.post('/api/sending-wallet/send-otp', {
        amount: data.amountInput,
        emailReceiver: data.receiver,
      })) as { status?: number; message?: string } | undefined;

      if (response && response.status === 200) {
        toast.success('OTP sent successfully. Please check your email.');
        setOtpState('Resend');
        setCountdown(120);
      } else {
        toast.error(response?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error while sending OTP');
    } finally {
      setIsSendingOtp(false);
    }
  });

  const onSubmitTransaction = async (data: SendingInputs) => {
    if (!checkAmountBalance(data.amountInput)) {
      toast.error('Please fix the balance error before submitting the transaction.');
      return;
    }

    if (!data.otp || data.otp.trim() === '') {
      setError('otp', { type: 'required', message: 'OTP is required' });
      toast.error('Please enter the OTP code.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await httpClient.post<{ status: number; message: string }>(
        '/api/sending-wallet/send-fx',
        {
          amount: data.amountInput,
          otp: data.otp,
          emailReciever: data.receiver,
          categoryId: data.categoryId,
          description: data.description,
          productIds: data.productId ? [data.productId] : [],
        },
      );

      if (response.status === 200) {
        toast.success(response.message || 'FX sent successfully!');
        refetchOverview();
        handleClose();
      } else {
        toast.error(response.message || 'Failed to send FX');
      }
    } catch (error: any) {
      if (error.message?.includes('Invalid OTP')) {
        toast.error('The OTP code is invalid or has expired!!');
        setError('otp', { type: 'manual', message: 'The OTP code is invalid or has expired!' });
      } else {
        toast.error(error.message || 'Error sending FX');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const isInitialLoading =
    !wallets ||
    wallets.length === 0 ||
    (!isLimitFetched && isLimitLoading) ||
    (!isCatalogFetched && isCatalogLoading);

  const isGlobalLoading = isInitialLoading || isOverviewLoading || isSendingOtp;

  const _renderContent = () => (
    <div className="relative">
      {isGlobalLoading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-xl">
          <Loading />
        </div>
      )}

      <Card className="w-full">
        <CardContent className="w-full pt-6 sm:space-y-6 space-y-4">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <MetricCard
              title="Daily Moving Limit"
              value={limit?.dailyMovingLimit || 0}
              type="neutral"
              icon="vault"
            />
            <MetricCard
              title="1-time Moving Limit"
              value={limit?.oneTimeMovingLimit || 0}
              type="total"
              icon="handCoins"
            />
            <MetricCard
              title="Moved Amount"
              value={limit?.movedAmount || 0}
              type="expense"
              icon="wallet"
            />
            <MetricCard
              title="Available Limit"
              value={limit?.availableLimit || 0}
              type="income"
              icon="arrowRight"
            />
          </div>

          <Separator />

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Receiver <span className="text-red-700">*</span>
                </label>
                <Controller
                  name="receiver"
                  control={control}
                  render={({ field }) => (
                    <ReceiverSelectField
                      value={field.value}
                      onChange={field.onChange}
                      error={
                        errors.receiver
                          ? { type: errors.receiver.type, message: errors.receiver.message }
                          : undefined
                      }
                      placeholder="Search receiver by email"
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="amountInput"
                  control={control}
                  render={({ field }) => (
                    <AmountSelect
                      key="amount"
                      name="amount"
                      currency={currency}
                      label="Amount"
                      required
                      value={field.value}
                      initialPackages={limit?.packageFXs}
                      onChange={field.onChange}
                      error={
                        errors.amountInput
                          ? { type: errors.amountInput.type, message: errors.amountInput.message }
                          : undefined
                      }
                      max={getCurrentBalance()}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category (Optional)
                </label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <CategorySelect
                      name="category"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      categories={categories || []}
                    />
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Product (Optional)
                </label>
                <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <ProductSelectField
                      name="product"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      products={products || []}
                    />
                  )}
                />
              </div>
            </div>
            <div className="sm:grid flex gap-4 items-start">
              <div className="flex-1">
                <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <TextareaField
                      label="Description (Optional)"
                      name="description"
                      placeholder="Add a description for the receiver..."
                      onChange={field.onChange}
                      value={field.value ?? ''}
                      rows={3}
                    />
                  )}
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-2 flex gap-4 items-start">
              <div className="flex-1">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <InputOtp
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      error={
                        errors.otp
                          ? { type: errors.otp.type, message: errors.otp.message }
                          : undefined
                      }
                    />
                  )}
                />
              </div>
              <SendOtpButton
                classNameBtn="mt-[25px]"
                state={otpState}
                callback={handleGetOtp}
                countdown={120}
                isStartCountdown={otpState !== 'Get'}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <GlobalDialog
      open={isShowSendingFXForm}
      onOpenChange={handleClose}
      onCancel={handleClose}
      onConfirm={handleSubmit(onSubmitTransaction)}
      confirmText="Submit"
      renderContent={_renderContent}
      cancelText="Cancel"
      type="info"
      isLoading={isGlobalLoading}
      title="SENDING FX"
      description="Please be careful when sending your FX to another user. Any mistaken transaction will be your responsibility."
      className="w-full max-w-[95vw] md:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8 bg-white"
    />
  );
}

export default SendingFXForm;
