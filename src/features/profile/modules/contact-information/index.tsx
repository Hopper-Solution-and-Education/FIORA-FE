'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSendOTPMutation, useVerifyOTPMutation } from '@/features/profile/store/api/profileApi';
import { Phone } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import OtpVerificationModal from './components/OtpVerificationModal';

const ContactInformationForm = () => {
  const [sendOTP, { isLoading: isSendingOtp }] = useSendOTPMutation();

  const [verifyOTP] = useVerifyOTPMutation();

  const [otpModal, setOtpModal] = useState({
    isOpen: false,
    type: 'email' as 'email' | 'phone',
    otpValue: '',
    countdown: 120,
  });

  const handleCloseOtpModal = useCallback(() => {
    setOtpModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      // const res = await verifyOTP({ otp }).unwrap();
      if (otp === '123456') {
        handleCloseOtpModal();
        toast.success('OTP verified successfully');
      } else {
        toast.error('OTP is incorrect');
      }
      // if (res.status === 201) {
      // } else {
      //   toast.error('Something went wrong');
      // }
    },
    [handleCloseOtpModal, verifyOTP],
  );

  const handleOtpModalChange = useCallback((modal: typeof otpModal) => {
    setOtpModal(modal);
  }, []);

  const onSendOtp = useCallback(async (type: 'email' | 'phone') => {
    const res = await sendOTP().unwrap();
    console.log('🚀 ~ ContactInformationForm ~ res:', res);
    if (res.status === 201) {
      setOtpModal({
        isOpen: true,
        type,
        otpValue: '',
        countdown: 120,
      });
    } else {
      toast.error('Something went wrong');
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Contact Information
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Verify your contact details for secure communication
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="voanhphi@gmail.com"
              value="voanhphi@gmail.com"
              className="flex-1"
              readOnly
            />

            <Button
              onClick={() => onSendOtp('email')}
              variant="outline"
              size="sm"
              className="px-6 py-4 min-w-28"
              // disabled={disabled || isSubmitting}
              // className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSendingOtp ? <Icons.spinner className="animate-spin h-5 w-5" /> : 'Send OTP'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              placeholder="0317109704"
              value="0317109704"
              className="flex-1"
              readOnly
            />
            <Button
              // onClick={() => onSendOtp('email')}
              variant="outline"
              size="sm"
              className="px-6 py-4 min-w-28"
              // disabled={disabled || isSubmitting}
              // className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSendingOtp ? <Icons.spinner className="animate-spin h-5 w-5" /> : 'Send OTP'}
            </Button>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        otpModal={otpModal}
        onOtpModalChange={handleOtpModalChange}
        onClose={handleCloseOtpModal}
        onVerify={handleVerifyOtp}
      />
    </TooltipProvider>
  );
};

export default ContactInformationForm;
