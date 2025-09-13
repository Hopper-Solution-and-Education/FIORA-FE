import {
  useGetProfileQuery,
  useSendOTPMutation,
  useVerifyOTPMutation,
} from '@/features/profile/store/api/profileApi';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { OTP_COUNTDOWN_TIME, OtpModalState } from '../../types';

export const useContactInfoForm = () => {
  const [sendOTP, { isLoading: isSendingOtp }] = useSendOTPMutation();
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery();
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

  const onResendOtp = (type: 'email' | 'phone') => onSendOtp(type, true);

  return {
    otpModal,
    isSendingOtp,
    isLoadingProfile,
    profile,
    handleCloseOtpModal,
    handleVerifyOtp,
    handleOtpModalChange,
    onSendOtp,
    onResendOtp,
  };
};
