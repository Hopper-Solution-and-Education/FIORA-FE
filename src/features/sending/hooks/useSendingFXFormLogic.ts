import { ApiEndpointEnum } from '@/shared/constants';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import type { WalletSendingOverview } from '@/shared/types';
import { useAppSelector } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSendingFXAction } from '../utils/actions';
import { SendingInputs, sendingSchema } from '../utils/validation';

type OverviewSendingResponseType = { data: WalletSendingOverview };

export function useSendingFXFormLogic() {
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

  return {
    isShowSendingFXForm,
    isGlobalLoading,
    currency,
    limit,
    categories,
    products,
    otpState,
    countdown,
    control,
    errors,
    onGetOtp,
    onConfirm,
    onClose,
    getCurrentBalance,
  };
}
