'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { useSendOTPMutation, useVerifyOTPMutation } from '@/features/profile/store/api/profileApi';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { OTP_COUNTDOWN_TIME, OtpModalState } from '../types';
import OtpVerificationModal from './components/OtpVerificationModal';

type Props = {
  profile: UserProfile;
  isVerified: boolean;
};

const ContactInformationForm: FC<Props> = ({ profile, isVerified }) => {
  const [sendOTP, { isLoading: isSendingOtp }] = useSendOTPMutation();

  const [verifyOTP] = useVerifyOTPMutation();

  const [otpModal, setOtpModal] = useState<OtpModalState>({
    isOpen: false,
    type: null as 'email' | 'phone' | null,
    otpValue: '',
    email: '',
    phone: '',
    countdown: OTP_COUNTDOWN_TIME,
  });

  const handleCloseOtpModal = useCallback(() => {
    setOtpModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      try {
        await verifyOTP({ otp }).unwrap();
        handleCloseOtpModal();
        toast.success('OTP verified successfully');
      } catch (error) {
        console.log('🚀 ~ ContactInformationForm ~ error:', error);
        toast.error('OTP is incorrect');
      }
    },
    [handleCloseOtpModal, verifyOTP],
  );

  const handleOtpModalChange = useCallback((modal: typeof otpModal) => {
    setOtpModal(modal);
  }, []);

  const onSendOtp = async (type: 'email' | 'phone', isResend = false) => {
    if (otpModal.countdown !== OTP_COUNTDOWN_TIME && !isResend) {
      setOtpModal((prev) => ({ ...prev, isOpen: true }));
      return;
    }

    try {
      await sendOTP().unwrap();

      setOtpModal({
        isOpen: true,
        type,
        otpValue: '',
        countdown: OTP_COUNTDOWN_TIME,
        email: profile?.email || '',
        phone: profile?.phone || '',
      });
    } catch (error) {
      console.log('🚀 ~ ContactInformationForm ~ error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact Info</h1>
        {isVerified ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <p className="text-sm">Verified</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input id="email" type="email" value={profile?.email} className="flex-1" readOnly />

            <Button
              onClick={() => onSendOtp('email')}
              variant="outline"
              size="sm"
              className="px-6 py-4 min-w-28 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={isVerified}
            >
              {isSendingOtp ? <Icons.spinner className="animate-spin h-5 w-5" /> : 'Send OTP'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="flex gap-2">
            <Input id="phone" value={profile?.phone || ''} className="flex-1" readOnly />
            <Button
              variant="outline"
              size="sm"
              className="px-6 py-4 min-w-28 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={true}
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
        onResend={(type: 'email' | 'phone') => onSendOtp(type, true)}
      />
    </div>
  );
};

export default ContactInformationForm;
