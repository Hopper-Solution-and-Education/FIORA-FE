import { MetricCard } from '@/components/common/metric';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { setWithdrawFXFormClose } from '@/features/home/module/wallet';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { OtpState } from '../../types';
import AmountSelect from '../components/AmountSelect';
import BankAccountSelect from '../components/BankAccountSelect';
import InputOtp from '../components/InputOtp';
import SendOtpButton from '../components/SendOtpButton';

function WithdrawFXForm() {
  const dispatch = useAppDispatch();
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

  const handleGetOtp = () => {
    if (otpState === 'Get') {
      setOtpState('Resend');
    }
  };

  const handleSubmitForm = () => {
    setErrorBankAccount(undefined);
    setErrorAmount(undefined);
    setErrorOtp(undefined);

    if (!bankAccountSelected) {
      setErrorBankAccount({
        type: 'required',
        message: 'Bank account is required!',
      });

      return;
    } else if (!amountInput || Number(amountInput) <= 0) {
      setErrorAmount({
        type: 'value',
        message: 'Amount must be greater than 0!',
      });

      return;
    } else if (!otp) {
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

    console.log({
      'Bank Account': bankAccountSelected,
      Amount: amountInput,
      OTP: otp,
    });
  };

  return (
    <Dialog open={isShowWithdrawFXForm} onOpenChange={handleClose}>
      <DialogContent className="min-w-[700px] flex flex-col items-center">
        <DialogTitle className="text-3xl font-bold">WITHDRAW FX</DialogTitle>
        <DialogDescription className="text-center">
          Please be carefully when withdraw your FX, any mistaken will be responsible yourself.
        </DialogDescription>
        <DialogDescription className="mt-[-1rem]">
          Only suspicious transactions will be FIORA and Insurance case.
        </DialogDescription>

        <Card className="w-full">
          <CardContent className="w-full pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Daily Moving Limit"
                value={70000}
                type="neutral"
                icon="vault"
              />
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Daily Moving Limit"
                value={20000}
                type="total"
                icon="handCoins"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Daily Moving Limit"
                value={60000}
                type="expense"
                icon="banknoteArrowDown"
              />
              <MetricCard
                className="px-4 py-2 *:p-0"
                title="Daily Moving Limit"
                value={10000}
                type="income"
                icon="arrowLeftRight"
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <BankAccountSelect
                key="bank-account"
                name="bank-account"
                value={bankAccountSelected}
                label="Bank Account"
                onChange={setBankAccountSelected}
                required
                error={errorBankAccount}
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <InputOtp value={otp} onChange={setOtp} error={errorOtp} />
              <SendOtpButton state={otpState} callback={handleGetOtp} countdown={120} />
            </div>

            <CardDescription>
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
                <p>Done reading</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawFXForm;
