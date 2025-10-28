'use client';

import { Loading } from '@/components/common/atoms';
import { MetricCard } from '@/components/common/metric';
import { GlobalDialog } from '@/components/common/molecules';
import { Card, CardContent } from '@/components/ui/card';
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import ProductSelectField from '@/features/home/module/transaction/components/ProductSelectField';
import ReceiverSelectField from '@/features/home/module/transaction/components/ReceiverSelectField';
import {
  fetchFrozenAmountAsyncThunk,
  getWalletsAsyncThunk,
} from '@/features/home/module/wallet/slices/actions';
import { setSendingFXFormClose } from '@/features/home/module/wallet/slices/index';
import SendOtpButton from '@/features/wallet-withdraw/presentation/components/SendOtpButton';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { useAppDispatch, useAppSelector } from '@/store';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useCallback, useEffect, useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { toast } from 'sonner';
import type { OtpState, WalletSendingOverview } from '../../types';
import AmountSelect from '../components/AmountSelect';
import InputOtp from '../components/InputOtp';

type OverviewSendingResponseType = {
  data: WalletSendingOverview;
};

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
  const {
    data: overviewData,
    isLoading,
    mutate: refetchOverview,
  } = useDataFetch<OverviewSendingResponseType>({
    endpoint: ApiEndpointEnum.walletWithdraw,
    method: 'GET',
    refreshInterval: 1000 * 60 * 5,
  });

  // ================= FETCH =================
  const fetchLimit = async () => {
    try {
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
    try {
      await dispatch(getWalletsAsyncThunk()).unwrap();
      await Promise.all([fetchLimit(), fetchCatalog()]);
    } catch {
      toast.error('Failed to load initial data');
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    if (isShowSendingFXForm) fetchData();
  }, [isShowSendingFXForm, dispatch]);

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

  const handleGetOtp = async () => {
    if (isSendingOtp) return;

    // ✅ Dùng validateBase chung
    const isValid = validateBase();
    if (!isValid) return toast.error('Please fix errors before requesting OTP.');

    // ===== GỬI OTP =====
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
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Error while sending OTP');
    } finally {
      setLoadingOtp(false);
      setIsSendingOtp(false);
    }
  };

  const validateBase = (mode: 'otp' | 'submit' = 'otp') => {
    const currentBalance = getCurrentBalance();
    const newErrors: typeof errors = {};

    if (!receiver.trim()) {
      newErrors.receiver = { type: 'required', message: 'Receiver email is required' };
      setErrors(newErrors);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(receiver)) {
      newErrors.receiver = { type: 'pattern', message: 'Invalid email format' };
      setErrors(newErrors);
      return false;
    }

    if (!amountInput || amountInput <= 0) {
      newErrors.amount = { type: 'min', message: 'Amount must be greater than 0' };
      setErrors(newErrors);
      return false;
    } else if (amountInput > currentBalance) {
      newErrors.amount = {
        type: 'max',
        message: `Insufficient balance (${currentBalance.toLocaleString()} ${currency})`,
      };
      setErrors(newErrors);
      return false;
    }

    if (mode === 'submit' && !otp.trim()) {
      newErrors.otp = { type: 'required', message: 'OTP is required' };
      setErrors(newErrors);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateBase('otp')) return toast.error('Fix errors before requesting OTP.');
    if (!validateBase('submit')) return toast.error('Fix errors before submitting.');

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
  };

  const _renderContent = () => (
    <Card className="w-full">
      <CardContent className="w-full pt-6 sm:space-y-6 space-y-4">
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
          <MetricCard title="Moved Amount" value={limit.movedAmount} type="expense" icon="wallet" />
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
              <ReceiverSelectField
                value={receiver}
                onChange={setReceiver}
                error={errors.receiver}
                placeholder="Search receiver by email"
              />
            </div>

            <div>
              <AmountSelect
                key="amount"
                name="amount"
                currency={currency}
                label="Amount"
                required
                value={amountInput}
                onChange={setAmountInput}
                error={errors.amount}
                max={getCurrentBalance()}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category (Optional)
              </label>
              <CategorySelect
                name="category"
                value={categoryId}
                onChange={setCategoryId}
                categories={categories}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Product (Optional)
              </label>
              <ProductSelectField
                name="product"
                value={productId}
                onChange={setProductId}
                products={products}
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-2 flex gap-4 items-start">
            <div className="flex-1">
              <InputOtp value={otp} onChange={setOtp} error={errors.otp} />
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
  );

  if (isShowSendingFXForm && (isLoading || loading || isSendingOtp)) return <Loading />;
  // ================= RENDER =================
  return (
    <>
      <GlobalDialog
        open={isShowSendingFXForm}
        onOpenChange={handleClose}
        onCancel={handleClose}
        onConfirm={handleSubmit}
        confirmText="Submit"
        renderContent={_renderContent}
        cancelText="Cancel and go back"
        type="info"
        isLoading={loading || isLoading}
        title="SENDING FX"
        description="Please be careful when sending your FX to another user. Any mistaken transaction will be your responsibility."
        className="w-full max-w-[95vw] md:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8 bg-white"
      />
    </>
  );
}

export default SendingFXForm;
