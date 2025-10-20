'use client';

import { Loading } from '@/components/common/atoms';
import { MetricCard } from '@/components/common/metric';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton'; // ✅ thêm Skeleton để dùng cho LoadingCard
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import ProductSelectField from '@/features/home/module/transaction/components/ProductSelectField';
import { setSendingFXFormClose } from '@/features/home/module/wallet';
import {
  fetchFrozenAmountAsyncThunk,
  getWalletsAsyncThunk,
} from '@/features/home/module/wallet/slices/actions';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OtpState } from '../../types';
import AmountSelect from '../components/AmountSelect';
import InputOtp from '../components/InputOtp';

// 🧩 Component LoadingCard hiển thị khung giả khi đang tải
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

function SendingFXForm() {
  const dispatch = useAppDispatch();
  const { isShowSendingFXForm } = useAppSelector((state) => state.wallet);

  const [receiver, setReceiver] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<OtpState>('Get');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadingLimit, setIsLoadingLimit] = useState(false); // ✅ trạng thái loading limit
  const [loadingOtp, setLoadingOtp] = useState(false);

  const [limit, setLimit] = useState({
    dailyMovingLimit: 0,
    oneTimeMovingLimit: 0,
    movedAmount: 0,
    availableLimit: 0,
  });
  const [packageFXs, setPackageFXs] = useState<number[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const amountLimitData = async () => {
    try {
      setIsLoadingLimit(true); // ✅ bật loading
      const res = await fetch('/api/sending-wallet/amount-limit', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch amount limit');
      return await res.json();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoadingLimit(false); // ✅ tắt loading
    }
  };

  const catalogData = async () => {
    try {
      const res = await fetch('/api/sending-wallet/catalog', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch catalog');
      return await res.json();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    if (isShowSendingFXForm) {
      amountLimitData().then((res) => {
        if (res?.data) {
          const d = res.data;
          setLimit({
            dailyMovingLimit: d.dailyMovingLimit?.amount || 0,
            oneTimeMovingLimit: d.oneTimeMovingLimit?.amount || 0,
            movedAmount: d.movedAmount?.amount || 0,
            availableLimit: d.availableLimit?.amount || 0,
          });
          setPackageFXs(d.packageFXs || []);
        }
      });

      catalogData().then((res) => {
        if (res?.data) {
          const d = res.data;
          setCategories(d.categories || []);
          setProducts(d.products || []);
        }
      });
    }
  }, [isShowSendingFXForm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpState === 'Resend' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setOtpState('Get');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpState, countdown]);

  const handleClose = useCallback(() => {
    dispatch(setSendingFXFormClose());
    setReceiver('');
    setCategoryId('');
    setProductId('');
    setAmount('');
    setOtp('');
    setOtpState('Get');
  }, [dispatch]);

  // 📨 Gửi OTP
  const handleGetOtp = async () => {
    if (!receiver) return toast.error('Receiver email required');
    if (!amount) return toast.error('Amount required');

    setLoadingOtp(true);
    try {
      const res = await fetch('/api/sending-wallet/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          emailReceiver: receiver,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 200) {
        toast.success('OTP has been sent successfully. Please check your email!');
        setOtpState('Resend');
        setCountdown(120);
      } else {
        toast.error(data.message || 'Failed to send OTP');
        setOtpState('Get');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while sending OTP');
      setOtpState('Get');
    } finally {
      setLoadingOtp(false);
    }
  };

  // 📨 Gửi lệnh chuyển FX
  const handleSubmit = async () => {
    if (!receiver) return toast.error('Receiver email required');
    if (!amount) return toast.error('Amount required');
    if (!otp || otp.length !== 6) return toast.error('OTP must be 6 digits');

    setLoading(true);
    try {
      const res = await fetch('/api/sending-wallet/send-fx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          otp,
          emailReciever: receiver,
          categoryId,
          productIds: productId ? [productId] : [],
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 200) {
        toast.success('Sending FX successfully!');

        // 🌀 Refresh lại toàn bộ ví & dashboard sau khi giao dịch thành công
        try {
          // 🧮 Refresh lại balance & frozen
          await dispatch(getWalletsAsyncThunk()).unwrap();
          await dispatch(fetchFrozenAmountAsyncThunk()).unwrap();

          // ✅ Refresh lại phần limit hiển thị trên form
          const limitRes = await amountLimitData();
          if (limitRes?.data) {
            const d = limitRes.data;
            setLimit({
              dailyMovingLimit: d.dailyMovingLimit?.amount || 0,
              oneTimeMovingLimit: d.oneTimeMovingLimit?.amount || 0,
              movedAmount: d.movedAmount?.amount || 0,
              availableLimit: d.availableLimit?.amount || 0,
            });
          }
        } catch (syncErr) {
          console.error('Sync error after sending FX:', syncErr);
          toast.error('Transaction completed but failed to sync dashboard.');
        }

        handleClose();
      } else {
        toast.error(data.message || 'Failed to send FX');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while sending FX');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🌀 Toàn màn hình khi đang submit */}
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
        <DialogContent
          className="
      w-full max-w-[95vw] md:max-w-[700px]
      max-h-[90vh] overflow-y-auto
      rounded-2xl shadow-2xl 
      p-6 md:p-8 bg-white
      scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
    "
        >
          <DialogTitle className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-2">
            SENDING FX
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 mb-6 md:mb-8 text-sm leading-relaxed">
            Please be careful when sending your FX to another user.
            <br /> Any mistaken transaction will be your responsibility.
          </DialogDescription>

          {/* LIMIT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 md:mb-8">
            {isLoadingLimit ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* Receiver + Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Receiver <span className="text-red-700">*</span>
                </label>
                <Input
                  placeholder="Enter receiver email"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div>
              <div>
                <AmountSelect
                  value={Number(amount) || undefined}
                  onChange={(v) => setAmount(v.toString())}
                  label="Amount"
                  currency="FX"
                  required
                  initialPackages={packageFXs}
                />
              </div>
            </div>

            {/* Category + Product */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category <span className="text-red-700">*</span>
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
                  Product <span className="text-red-700">*</span>
                </label>
                <ProductSelectField
                  name="product"
                  value={productId}
                  onChange={setProductId}
                  products={products}
                />
              </div>
            </div>

            {/* OTP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
              <InputOtp value={otp} onChange={setOtp} />
              <Button
                onClick={handleGetOtp}
                disabled={loadingOtp || otpState === 'Resend'}
                className="rounded-lg bg-white text-black border border-gray-300 hover:bg-gray-100 text-sm px-3 py-1 flex items-center justify-center gap-2"
              >
                {loadingOtp ? (
                  <>
                    <Icons.spinner className="animate-spin w-4 h-4" />
                    Sending...
                  </>
                ) : otpState === 'Resend' ? (
                  `Resend (${countdown}s)`
                ) : (
                  'Get OTP'
                )}
              </Button>
            </div>
          </div>

          <p className="text-gray-500 text-xs mt-6 text-center leading-relaxed">
            By inputting the OTP and clicking the confirm button, you acknowledge full
            responsibility for this transaction.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              className="rounded-lg border-gray-300 px-6 text-gray-700 hover:bg-gray-100"
              onClick={handleClose}
            >
              <Icons.arrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black border border-gray-300 hover:bg-gray-100 hover:text-black px-4 py-1"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Icons.spinner className="animate-spin w-4 h-4" />
                  Processing...
                </>
              ) : (
                <Icons.check className="w-4 h-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SendingFXForm;
function refreshBalance() {
  throw new Error('Function not implemented.');
}
