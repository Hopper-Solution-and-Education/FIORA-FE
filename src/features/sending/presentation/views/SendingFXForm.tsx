'use client';

import { MetricCard } from '@/components/common/metric';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import CategorySelect from '@/features/home/module/category/components/CategorySelect';
import { setSendingFXFormClose } from '@/features/home/module/wallet';
import ProductSelect from '@/features/setting/module/product/presentation/atoms/ProductSelect';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useState } from 'react';
import { OtpState } from '../../types';
import InputOtp from '../components/InputOtp';
import SendOtpButton from '../components/SendOtpButton';

function SendingFXForm() {
  const dispatch = useAppDispatch();
  const { isShowSendingFXForm } = useAppSelector((state) => state.wallet);

  const [receiver, setReceiver] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<OtpState>('Get');

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
      <DialogContent className="min-w-[700px] rounded-xl shadow-lg px-10 py-6">
        <DialogTitle className="text-2xl font-bold text-center mb-2 tracking-wide">
          SENDING FX
        </DialogTitle>
        <DialogDescription className="text-center text-gray-500 mb-6 text-sm">
          Please be carefully when sending your FX to another user, any mistaken will be responsible
          yourself. Only suspicious transactions will be FIORA and Insurance case.
        </DialogDescription>

        {/* LIMIT CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <MetricCard title="Daily Moving Limit" value={70000} type="neutral" icon="vault" />
          <MetricCard title="1-time Moving Limit" value={20000} type="total" icon="handCoins" />
          <MetricCard title="Moved Amount" value={60000} type="expense" icon="wallet" />
          <MetricCard title="Available Limit" value={10000} type="income" icon="arrowRight" />
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Receiver */}
            <div>
              <label className="text-sm font-medium mb-1 block">Receiver *</label>
              <Input
                placeholder="Please type an email!"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              />
            </div>
            {/* Amount */}
            <div>
              <label className="text-sm font-medium mb-1 block">Amount *</label>
              <Input
                placeholder="Please type or select amount!"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Category + Product */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <CategorySelect value={categoryId} onChange={setCategoryId} name="" categories={[]} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Product</label>
              <ProductSelect productId={productId} />
            </div>
          </div>

          {/* OTP */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <InputOtp value={otp} onChange={setOtp} />
            <SendOtpButton state={otpState} callback={handleGetOtp} countdown={120} />
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
          By input OTP and click submit button, you confirm that this transaction is unsuspicious
          and will be fully responsible yourself!
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between items-center mt-6 w-full">
          <Button
            variant="outline"
            className="rounded-lg border-gray-300 px-6"
            onClick={handleClose}
          >
            ←
          </Button>
          <Button
            className="rounded-lg bg-blue-600 text-white px-6 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            ✓
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SendingFXForm;
