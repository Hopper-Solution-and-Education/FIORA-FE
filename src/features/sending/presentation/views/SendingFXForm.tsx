'use client';

import { GlobalDialog } from '@/components/common/molecules';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import type { WalletSendingOverview } from '@/shared/types/otp';
import { useAppSelector } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSendingFXAction } from '../../utils/actions';
import SendingFXFormContent from './SendingFXFormContent';

import { SendingInputs, sendingSchema } from '../../utils/validation';

type OverviewSendingResponseType = { data: WalletSendingOverview };

export default function SendingFXForm() {
  const { isShowSendingFXForm, wallets } = useAppSelector((s) => s.wallet);
  const { currency } = useAppSelector((s) => s.settings);
  const {
    limit,
    isFetched: isLimitFetched,
    isLoading: isLimitLoading,
  } = useAppSelector((s) => s.limitData);
  const {
    catalog,
    isFetched: isCatalogFetched,
    isLoading: isCatalogLoading,
  } = useAppSelector((s) => s.catalogData);

  const { categories, products } = catalog || { categories: [], products: [] };

  const { isLoading: isOverviewLoading } = useDataFetch<OverviewSendingResponseType>({
    endpoint: ApiEndpointEnum.walletWithdraw,
    method: 'GET',
    refreshInterval: 1000 * 60 * 5,
  });

  const {
    otpState,
    countdown,
    isLoading: actionIsLoading,
    handleGetOtp: actionHandleGetOtp,
    handleSubmit: actionHandleSubmit,
    handleClose: actionHandleClose,
    checkAmountBalance,
    getCurrentBalance,
  } = useSendingFXAction();

  const {
    control,
    handleSubmit,
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

  const isGlobalLoading =
    !wallets ||
    wallets.length === 0 ||
    (!isLimitFetched && isLimitLoading) ||
    (!isCatalogFetched && isCatalogLoading) ||
    isOverviewLoading ||
    actionIsLoading;

  const onGetOtp = handleSubmit((data) =>
    actionHandleGetOtp(data, (amount: number) => checkAmountBalance(amount, setError, clearErrors)),
  );

  const onConfirm = handleSubmit((data) =>
    actionHandleSubmit(
      data,
      (amount: number) => checkAmountBalance(amount, setError, clearErrors),
      setError,
      reset,
    ),
  );

  const onClose = () => actionHandleClose(reset);

  return (
    <GlobalDialog
      open={isShowSendingFXForm}
      onOpenChange={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmText="Submit"
      cancelText="Cancel"
      type="info"
      isLoading={isGlobalLoading}
      title="SENDING FX"
      description="Please be careful when sending your FX to another user. Any mistaken transaction will be your responsibility."
      className="w-full max-w-[95vw] md:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8 bg-white"
      renderContent={() => (
        <SendingFXFormContent
          control={control}
          errors={errors}
          currency={currency}
          limit={limit}
          categories={categories}
          products={products}
          otpState={otpState}
          countdown={countdown}
          isGlobalLoading={isGlobalLoading}
          onGetOtp={onGetOtp}
          getCurrentBalance={getCurrentBalance}
        />
      )}
    />
  );
}
