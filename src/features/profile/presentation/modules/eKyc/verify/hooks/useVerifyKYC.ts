'use client';

import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import {
  useSendOtpVerifyEKYCMutation,
  useVerifyEKYCMutation,
  useVerifyOtpVerifyEKYCMutation,
} from '@/features/profile/store/api/profileApi';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseVerifyKYCProps {
  kycId?: string;
  onSuccess?: () => void;
}

export const useVerifyKYC = ({ kycId, onSuccess }: UseVerifyKYCProps = {}) => {
  const [verifyEKYC, { isLoading: isVerifyingKYC }] = useVerifyEKYCMutation();
  const [sendOtpVerifyEKYC, { isLoading: isSendingOtp }] = useSendOtpVerifyEKYCMutation();
  const [verifyOtpVerifyEKYC, { isLoading: isVerifyingOtp }] = useVerifyOtpVerifyEKYCMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [remarks, setRemarks] = useState('');

  const handleOpenApprove = () => {
    setModalType('approve');
    setModalOpen(true);
  };

  const handleOpenReject = () => {
    setModalType('reject');
    setModalOpen(true);
  };

  const handleSendOtp = async () => {
    try {
      await sendOtpVerifyEKYC().unwrap();
      toast.success('OTP sent to your email');
      setModalOpen(false);
      setOtpModalOpen(true);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const result = await verifyOtpVerifyEKYC({ otp }).unwrap();

      if (!result.valid) {
        toast.error('Invalid OTP');
        return;
      }

      await handleFinalVerify();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error?.message || 'Invalid OTP');
    }
  };

  const handleFinalVerify = async () => {
    if (!kycId) {
      toast.error('eKYC data not found');
      return;
    }

    try {
      const status = modalType === 'approve' ? EKYCStatus.APPROVAL : EKYCStatus.REJECTED;
      await verifyEKYC({
        kycId,
        status,
        remarks: remarks || '',
      }).unwrap();

      toast.success(
        modalType === 'approve' ? 'eKYC approved successfully' : 'eKYC rejected successfully',
      );
      setOtpModalOpen(false);
      setRemarks('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error verifying eKYC:', error);
      toast.error(error?.message || 'Failed to verify eKYC');
    }
  };

  const handleVerify = async (remarksText?: string) => {
    setRemarks(remarksText || '');
    await handleSendOtp();
  };

  return {
    modalOpen,
    setModalOpen,
    otpModalOpen,
    setOtpModalOpen,
    modalType,
    isVerifying: isVerifyingKYC || isVerifyingOtp,
    isSendingOtp,
    handleOpenApprove,
    handleOpenReject,
    handleVerify,
    handleVerifyOtp,
    handleSendOtp,
  };
};

export default useVerifyKYC;
