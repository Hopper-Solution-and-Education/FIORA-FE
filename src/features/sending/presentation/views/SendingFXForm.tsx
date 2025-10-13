'use client';

import { MetricCard } from '@/components/common/metric';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import ProductSelectField from '@/features/home/module/transaction/components/ProductSelectField';
import ReceiverSelectField from '@/features/home/module/transaction/components/ReceiverSelectField';
import { setSendingFXFormClose } from '@/features/home/module/wallet';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { OtpState } from '../../types';
import InputOtp from '../components/InputOtp';
import SendOtpButton from '../components/SendOtpButton';

function SendingFXForm() {
  const dispatch = useAppDispatch();
  const { isShowSendingFXForm } = useAppSelector((state) => state.wallet);

  const [receiver, setReceiver] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<OtpState>('Get');
  const [limit, setLimit] = useState({
    dailyMovingLimit: 0,
    oneTimeMovingLimit: 0,
    movedAmount: 0,
    availableLimit: 0,
  });

  const amountLimitData = async () => {
    try {
      const res = await fetch('/api/sending-wallet/amount-limit', { method: 'GET' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch amount limit: ${res.status} ${res.statusText}\n${text}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
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
        }
      });
    }
  }, [isShowSendingFXForm]);

  const handleClose = useCallback(() => {
    dispatch(setSendingFXFormClose());
    setReceiver('');
    setCategoryId('');
    setProductId('');
    setAmount('');
    setOtp('');
    setOtpState('Get');
  }, [dispatch]);

  const handleGetOtp = async () => {
    if (otpState === 'Get') {
      await fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ receiver }) });
      setOtpState('Resend');
    }
  };

  const handleSubmit = async () => {
    if (!receiver) return alert('Receiver email required');
    if (!amount) return alert('Amount required');
    if (otp.length !== 6) return alert('OTP must be 6 digits');
    await fetch('/api/send-transaction', {
      method: 'POST',
      body: JSON.stringify({ receiver, categoryId, productId, amount, otp }),
    });
    handleClose();
  };

  return (
    <Dialog open={isShowSendingFXForm} onOpenChange={handleClose}>
      <DialogContent className="min-w-[700px] rounded-2xl shadow-2xl p-8 bg-white">
        <DialogTitle className="text-2xl font-semibold text-center text-gray-800 mb-2">
          SENDING FX
        </DialogTitle>
        <DialogDescription className="text-center text-gray-500 mb-8 text-sm leading-relaxed">
          Please be careful when sending your FX to another user.
          <br /> Any mistaken transaction will be your responsibility.
        </DialogDescription>

        {/* LIMIT CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
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

        {/* FORM */}
        <div className="space-y-5">
          {/* Receiver + Amount */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Receiver *</label>
              <ReceiverSelectField name="receiver" value={accountId} onChange={setAccountId} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Amount *</label>
              <Input
                placeholder="Enter amount to send"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Category + Product */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <CategorySelect value={categoryId} onChange={setCategoryId} name="" categories={[]} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Product</label>
              <ProductSelectField name="product" value={productId} onChange={setProductId} />
            </div>
          </div>

          {/* OTP */}
          <div className="grid grid-cols-2 gap-5 items-end">
            <InputOtp value={otp} onChange={setOtp} />
            <SendOtpButton state={otpState} callback={handleGetOtp} countdown={120} />
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-6 text-center leading-relaxed">
          By inputting the OTP and clicking the confirm button, you acknowledge full responsibility
          for this transaction.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            className="rounded-lg border-gray-300 px-8 text-gray-700 hover:bg-gray-100"
            onClick={handleClose}
          >
            ← Cancel
          </Button>
          <Button
            className="rounded-lg bg-blue-600 text-white px-8 font-semibold hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            ✓ Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SendingFXForm;
