import { MetricCard } from '@/components/common/metric';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { Loading } from '@/components/common/atoms';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { httpClient } from '@/config';
import { setWithdrawFXFormClose, Wallet } from '@/features/home/module/wallet';
import { WalletType } from '@/features/home/module/wallet/domain/enum';
import {
  fetchFrozenAmountAsyncThunk,
  getWalletsAsyncThunk,
} from '@/features/home/module/wallet/slices/actions';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { Response } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { toast } from 'sonner';
import { OtpState, WalletWithdrawOverview } from '../../types';
import errorCatching from '../../utils/errorCatching';
import AmountSelect from '../components/AmountSelect';
import BankAccountSelect from '../components/BankAccountSelect';
import InputOtp from '../components/InputOtp';
import SendOtpButton from '../components/SendOtpButton';

type OverviewWithdrawResponseType = {
  data: WalletWithdrawOverview;
};

function WithdrawFXForm() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { isShowWithdrawFXForm } = useAppSelector((state) => state.wallet);
  const { currency } = useAppSelector((state) => state.settings);
  const router = useRouter();
  const [bankAccountSelected, setBankAccountSelected] = useState<string>('');
  const [amountInput, setAmountInput] = useState<number>(0);
  const [otp, setOtp] = useState<string>('');
  const [otpState, setOtpState] = useState<OtpState>('Get');
  const [errorBankAccount, setErrorBankAccount] = useState<FieldError | undefined>(undefined);
  const [errorAmount, setErrorAmount] = useState<FieldError | undefined>(undefined);
  const [errorOtp, setErrorOtp] = useState<FieldError | undefined>(undefined);
  const [paymentBalance, setPaymentBalance] = useState<number>(0);
  const {
    data: overviewData,
    isLoading,
    mutate: refetchOverview,
  } = useDataFetch<OverviewWithdrawResponseType>({
    endpoint: ApiEndpointEnum.walletWithdraw,
    method: 'GET',
    refreshInterval: 1000 * 60 * 5,
  });

  const handleClose = useCallback(() => {
    dispatch(setWithdrawFXFormClose());
    setBankAccountSelected('');
    setAmountInput(0);
    setOtp('');
    setOtpState('Get');
    setErrorBankAccount(undefined);
    setErrorAmount(undefined);
    setErrorOtp(undefined);
  }, [dispatch]);

  const isFieldErrorBeforeOtp = () => {
    setErrorBankAccount(undefined);
    setErrorAmount(undefined);

    if (!bankAccountSelected) {
      setErrorBankAccount({
        type: 'required',
        message: 'Bank account is required!',
      });

      return true;
    } else if (!amountInput || Number(amountInput) <= 0) {
      setErrorAmount({
        type: 'value',
        message: 'Amount must be greater than 0!',
      });

      return true;
    } else if (paymentBalance !== 0 && Number(amountInput) > paymentBalance) {
      setErrorAmount({
        type: 'value',
        message: Messages.INSUFFICIENT_BALANCE,
      });

      return true;
    }

    return false;
  };

  const handleGetOtp = async () => {
    if (isFieldErrorBeforeOtp()) return;

    if (otpState === 'Get') {
      setOtpState('Resend');
    }

    try {
      const response: Response<any> = await httpClient.post(ApiEndpointEnum.getOtp, {});

      if (response.status === RESPONSE_CODE.CREATED) {
        toast.success(response.message);
      } else {
        toast.error(response.message || 'Something went wrong!');
      }
    } catch (error: unknown) {
      toast.error(errorCatching(error)?.message);
    }
  };

  const handleSubmitForm = async () => {
    setErrorOtp(undefined);

    if (isFieldErrorBeforeOtp()) return;

    if (!otp) {
      setErrorOtp({
        type: 'value',
        message: 'OTP is required!',
      });

      return;
    } else if (!/^\d+$/.test(otp)) {
      setErrorOtp({
        type: 'value',
        message: 'OTP must be a number!',
      });

      return;
    } else if (otp.length !== 6) {
      setErrorOtp({
        type: 'value',
        message: 'OTP must be 6 digits!',
      });

      return;
    }

    if (amountInput > (overviewData?.data?.data?.onetime_moving_limit ?? 0)) {
      toast.error('Exceeded the allowable one-time withdrawal limit');
      return;
    }

    if (amountInput > (overviewData?.data?.data?.available_limit ?? 0)) {
      toast.error('Exceeded the allowable daily withdrawal limit');
      return;
    }

    // Call api
    try {
      setLoading(true);

      const response: Response<any> = await httpClient.post(ApiEndpointEnum.walletWithdraw, {
        amount: amountInput,
        otp,
      });

      setLoading(false);

      if (response.status === RESPONSE_CODE.CREATED) {
        dispatch(getWalletsAsyncThunk());
        dispatch(fetchFrozenAmountAsyncThunk());
        toast.success(response.message);
        refetchOverview();
        handleClose();
      } else {
        toast.error(response.message || 'Something went wrong!');
      }
    } catch (error: unknown) {
      setLoading(false);
      toast.error(errorCatching(error)?.message);
    }
  };

  useEffect(() => {
    if (!isShowWithdrawFXForm) return;

    const fetchWalletData = async () => {
      try {
        const query = {
          type: WalletType.Payment,
        };

        const params = new URLSearchParams(query);
        const response: Response<Wallet> = await httpClient.get(
          `${ApiEndpointEnum.Wallet}?${params}`,
        );

        if (response && response?.data?.frBalanceActive) {
          setPaymentBalance(Number(response?.data?.frBalanceActive));
        }
      } catch (error) {
        toast.error('Network error or invalid response!');
        console.error(error);
      }
    };

    fetchWalletData();
  }, [isShowWithdrawFXForm]);

  if (isShowWithdrawFXForm && (isLoading || loading)) return <Loading />;
  return (
    <Dialog open={isShowWithdrawFXForm} onOpenChange={handleClose}>
      <DialogContent className="md:min-w-[700px] max-h-screen flex flex-col items-center rounded-md overflow-scroll">
        <DialogTitle className="text-3xl font-bold sm:block hidden">WITHDRAW FX</DialogTitle>
        <DialogDescription className="text-center sm:block hidden">
          Please be carefully when withdraw your FX, any mistaken will be responsible yourself.
        </DialogDescription>
        <DialogDescription className="mt-[-1rem] sm:block hidden">
          Only suspicious transactions will be FIORA and Insurance case.
        </DialogDescription>

        <Card className="w-full">
          <CardContent className="w-full pt-6 sm:space-y-6 space-y-4">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Daily Moving Limit"
                value={Number(overviewData?.data?.data?.daily_moving_limit)}
                type="neutral"
                icon="vault"
              />
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="1-time Moving Limit"
                value={Number(overviewData?.data?.data?.onetime_moving_limit)}
                type="total"
                icon="handCoins"
              />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Moved Amount"
                value={Number(overviewData?.data?.data?.moved_amount)}
                type="expense"
                icon="banknoteArrowDown"
              />
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Available Limit"
                value={Number(overviewData?.data?.data?.available_limit)}
                type="income"
                icon="arrowLeftRight"
              />
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <BankAccountSelect
                key="bank-account"
                name={overviewData?.data?.data?.bankAccount?.accountName || ''}
                value={overviewData?.data?.data?.bankAccount?.accountNumber || ''}
                label="Bank Account"
                onChange={setBankAccountSelected}
                required
                error={errorBankAccount}
                className="mb-0"
              />
              <AmountSelect
                key="amount"
                name="amount"
                currency={currency}
                label="Amount"
                required={true}
                value={amountInput}
                onChange={setAmountInput}
                error={errorAmount}
                className="mb-0"
              />
            </div>

            <div className="sm:grid sm:grid-cols-2 flex gap-4 items-start">
              <InputOtp className="flex-1" value={otp} onChange={setOtp} error={errorOtp} />
              <SendOtpButton
                classNameBtn="mt-[25px]"
                state={otpState}
                callback={handleGetOtp}
                countdown={120}
                isStartCountdown={otpState !== 'Get'}
              />
            </div>

            <CardDescription className="sm:block hidden">
              By input OTP and click submit button, you confirm that this transaction is
              unsuspicious and will be fully responsible yourself!
            </CardDescription>
          </CardContent>
        </Card>

        <TooltipProvider>
          <div className="w-full flex items-center justify-between gap-4 mt-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                >
                  <Icons.circleArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cancel and go back</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={handleSubmitForm}
                  className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Icons.check className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Submit</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawFXForm;
