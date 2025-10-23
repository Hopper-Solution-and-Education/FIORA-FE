'use client';

import { Loading } from '@/components/common/atoms';
import { MetricCard } from '@/components/common/metric';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import ProductSelectField from '@/features/home/module/transaction/components/ProductSelectField';
import ReceiverSelectField from '@/features/home/module/transaction/components/ReceiverSelectField';
import {
  fetchFrozenAmountAsyncThunk,
  getWalletsAsyncThunk,
} from '@/features/home/module/wallet/slices/actions';
import { setSendingFXFormClose } from '@/features/home/module/wallet/slices/index';
import SendOtpButton from '@/features/wallet-withdraw/presentation/components/SendOtpButton';
import { useAppDispatch, useAppSelector } from '@/store';
import { Separator } from '@radix-ui/react-dropdown-menu';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { toast } from 'sonner';
import type { OtpState } from '../../types';
import AmountSelect from '../components/AmountSelect';
import InputOtp from '../components/InputOtp';

const LoadingCard = () => (
  <div className="rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

const initialFormState = {
  receiver: '',
  categoryId: '',
  productId: '',
  amountInput: 0,
  otp: '',
  otpState: 'Get' as OtpState,
  countdown: 0,
  errors: {} as {
    receiver?: FieldError;
    amount?: FieldError;
    category?: FieldError;
    product?: FieldError;
    otp?: FieldError;
  },
};

function SendingFXForm() {
  const dispatch = useAppDispatch();
  const { isShowSendingFXForm, wallets } = useAppSelector((s) => s.wallet);
  const { currency } = useAppSelector((state) => state.settings);

  const [receiver, setReceiver] = useState(initialFormState.receiver);
  const [categoryId, setCategoryId] = useState(initialFormState.categoryId);
  const [productId, setProductId] = useState(initialFormState.productId);
  const [amountInput, setAmountInput] = useState(initialFormState.amountInput);
  const [otp, setOtp] = useState(initialFormState.otp);
  const [otpState, setOtpState] = useState(initialFormState.otpState);
  const [countdown, setCountdown] = useState(initialFormState.countdown);
  const [errors, setErrors] = useState(initialFormState.errors);

  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [isLoadingLimit, setIsLoadingLimit] = useState(false);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [limit, setLimit] = useState({
    dailyMovingLimit: 0,
    oneTimeMovingLimit: 0,
    movedAmount: 0,
    availableLimit: 0,
    currency: currency,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // ================= FETCH =================
  const fetchLimit = async () => {
    try {
      setIsLoadingLimit(true);
      const res = await fetch('/api/sending-wallet/amount-limit');
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch limit');
      const d = json.data;
      setLimit({
        dailyMovingLimit: d.dailyMovingLimit?.amount || 0,
        oneTimeMovingLimit: d.oneTimeMovingLimit?.amount || 0,
        movedAmount: d.movedAmount?.amount || 0,
        availableLimit: d.availableLimit?.amount || 0,
        currency: d.currency || currency,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoadingLimit(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/sending-wallet/catalog');
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch catalog');
      const d = json.data;
      setCategories(d.categories || []);
      setProducts(d.products || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const fetchData = async () => {
    setWalletsLoading(true);
    try {
      await dispatch(getWalletsAsyncThunk()).unwrap();
      await Promise.all([fetchLimit(), fetchCatalog()]);
    } catch {
      toast.error('Failed to load initial data');
    } finally {
      setWalletsLoading(false);
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    if (isShowSendingFXForm) fetchData();
  }, [isShowSendingFXForm, dispatch]);

  useEffect(() => {
    if (otpState !== 'Resend' || countdown <= 0) return;
    const timer = setInterval(
      () =>
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setOtpState('Get');
            return 0;
          }
          return prev - 1;
        }),
      300,
    );
    return () => clearInterval(timer);
  }, [otpState, countdown]);

  // ================= DEBOUNCED SETTERS =================
  const debouncedSetReceiver = useCallback(
    debounce((val: string) => setReceiver(val), 300),
    [],
  );
  const debouncedSetAmountInput = useCallback(
    debounce((val: number) => setAmountInput(val), 300),
    [],
  );
  const debouncedSetCategoryId = useCallback(
    debounce((val: string) => setCategoryId(val), 300),
    [],
  );
  const debouncedSetProductId = useCallback(
    debounce((val: string) => setProductId(val), 300),
    [],
  );
  const debouncedSetOtp = useCallback(
    debounce((val: string) => setOtp(val), 300),
    [],
  );

  // ================= HANDLERS =================
  const handleClose = useCallback(() => {
    dispatch(setSendingFXFormClose());
    setReceiver(initialFormState.receiver);
    setCategoryId(initialFormState.categoryId);
    setProductId(initialFormState.productId);
    setAmountInput(initialFormState.amountInput);
    setOtp(initialFormState.otp);
    setOtpState(initialFormState.otpState);
    setCountdown(initialFormState.countdown);
    setErrors(initialFormState.errors);
  }, [dispatch]);

  const getCurrentBalance = (): number =>
    Number(wallets?.find((w: any) => w.type === 'Payment')?.frBalanceActive ?? 0);

  const handleGetOtp = useCallback(
    debounce(async () => {
      if (isSendingOtp) return;
      if (walletsLoading) return toast.error('Wallet is still loading. Please wait.');
      if (!receiver.trim()) return toast.error('Receiver email required');
      if (!amountInput || amountInput <= 0) return toast.error('Amount required');

      const currentBalance = getCurrentBalance();
      if (currentBalance <= 0) return toast.error('Wallet data not loaded or balance is zero');
      if (amountInput > currentBalance)
        return toast.error(`Insufficient balance (${currentBalance.toLocaleString()} ${currency})`);

      setIsSendingOtp(true);
      setLoadingOtp(true);

      try {
        const res = await fetch('/api/sending-wallet/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amountInput, emailReceiver: receiver }),
        });
        const data = await res.json();
        if (res.ok && data.status === 200) {
          toast.success('OTP sent successfully. Please check your email.');
          setOtpState('Resend');
          setCountdown(120);
        } else toast.error(data.message || 'Failed to send OTP');
      } catch {
        toast.error('Error while sending OTP');
      } finally {
        setLoadingOtp(false);
        setIsSendingOtp(false);
      }
    }, 300),
    [isSendingOtp, walletsLoading, receiver, amountInput, currency, getCurrentBalance],
  );

  const validateForm = (): boolean => {
    const currentBalance = getCurrentBalance();

    // Validate receiver
    if (!receiver.trim()) {
      setErrors({ receiver: { type: 'required', message: 'Receiver email is required' } });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(receiver)) {
      setErrors({ receiver: { type: 'pattern', message: 'Invalid email format' } });
      return false;
    }

    // Validate amount
    if (!amountInput || amountInput <= 0) {
      setErrors({ amount: { type: 'min', message: 'Amount must be greater than 0' } });
      return false;
    }
    if (amountInput > currentBalance) {
      setErrors({
        amount: {
          type: 'max',
          message: `Insufficient balance (${currentBalance.toLocaleString()} ${currency})`,
        },
      });
      return false;
    }

    // Validate OTP
    if (!otp.trim()) {
      setErrors({ otp: { type: 'required', message: 'OTP is required' } });
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: { type: 'pattern', message: 'OTP must be 6 digits numeric' } });
      return false;
    }

    // Nếu tất cả hợp lệ
    setErrors({});
    return true;
  };

  const handleSubmit = useCallback(
    debounce(async () => {
      if (!validateForm()) return toast.error('Please fix the errors before submitting.');

      setLoading(true);
      try {
        const res = await fetch('/api/sending-wallet/send-fx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInput,
            otp,
            emailReciever: receiver,
            categoryId,
            productIds: productId ? [productId] : [],
          }),
        });
        const data = await res.json();

        if (res.ok && data.status === 200) {
          toast.success('FX sent successfully!');
          await Promise.all([
            dispatch(getWalletsAsyncThunk()).unwrap(),
            dispatch(fetchFrozenAmountAsyncThunk()).unwrap(),
          ]);
          await fetchLimit();
          handleClose();
        } else toast.error(data.message || 'Failed to send FX');
      } catch {
        toast.error('Error while sending FX');
      } finally {
        setLoading(false);
      }
    }, 300),
    [receiver, amountInput, otp, categoryId, productId],
  );

  // ================= RENDER =================
  return (
    <>
      {loading && (
        <Loading
          message="Processing your transaction..."
          description="Please wait while we complete your request."
          spinnerType="pulse"
          size="md"
          bgColor="bg-black/50"
        />
      )}

      <Dialog open={isShowSendingFXForm} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8 bg-white">
          <DialogTitle className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-2">
            SENDING FX
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 mb-6 md:mb-8 text-sm leading-relaxed">
            Please be careful when sending your FX to another user.
            <br />
            Any mistaken transaction will be your responsibility.
          </DialogDescription>

          <Card className="w-full">
            <CardContent className="w-full pt-6 sm:space-y-6 space-y-4">
              {isLoadingLimit ? (
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <MetricCard
                      title="Daily Moving Limit"
                      value={limit.dailyMovingLimit}
                      type="neutral"
                      icon="vault"
                    />
                    <MetricCard
                      title="1-time Moving Limit"
                      value={limit.oneTimeMovingLimit}
                      type="total"
                      icon="handCoins"
                    />
                    <MetricCard
                      title="Moved Amount"
                      value={limit.movedAmount}
                      type="expense"
                      icon="wallet"
                    />
                    <MetricCard
                      title="Available Limit"
                      value={limit.availableLimit}
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
                        {walletsLoading ? (
                          <Skeleton className="h-12 w-full" />
                        ) : (
                          <ReceiverSelectField
                            value={receiver}
                            onChange={debouncedSetReceiver}
                            error={errors.receiver}
                            placeholder="Search receiver by email"
                          />
                        )}
                      </div>

                      <div>
                        {walletsLoading ? (
                          <Skeleton className="h-12 w-full" />
                        ) : (
                          <AmountSelect
                            key="amount"
                            name="amount"
                            currency={currency}
                            label="Amount"
                            required
                            value={amountInput}
                            onChange={debouncedSetAmountInput}
                            error={errors.amount}
                            max={getCurrentBalance()}
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Category (Optional)
                        </label>
                        {categories.length === 0 ? (
                          <Skeleton className="h-12 w-full" />
                        ) : (
                          <CategorySelect
                            name="category"
                            value={categoryId}
                            onChange={debouncedSetCategoryId}
                            categories={categories}
                          />
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Product (Optional)
                        </label>
                        {products.length === 0 ? (
                          <Skeleton className="h-12 w-full" />
                        ) : (
                          <ProductSelectField
                            name="product"
                            value={productId}
                            onChange={debouncedSetProductId}
                            products={products}
                          />
                        )}
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-2 flex gap-4 items-start">
                      <div className="flex-1">
                        <InputOtp value={otp} onChange={debouncedSetOtp} error={errors.otp} />
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
                </>
              )}
            </CardContent>
          </Card>

          <TooltipProvider>
            <div className="w-full flex items-center justify-between gap-4 mt-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleClose}
                    className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
                    onClick={handleSubmit}
                    disabled={loading || isLoadingLimit || walletsLoading}
                    className="w-32 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                  >
                    <Icons.check className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Submit transaction</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SendingFXForm;
