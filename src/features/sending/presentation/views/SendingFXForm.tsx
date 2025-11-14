'use client';

import { GlobalDialog } from '@/components/common/molecules';
import { useSendingFXFormLogic } from '../../hooks/useSendingFXFormLogic';
import SendingFXFormContent from './SendingFXFormContent';

export default function SendingFXForm() {
  const {
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
  } = useSendingFXFormLogic();

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
