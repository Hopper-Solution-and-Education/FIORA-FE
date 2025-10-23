'use client';

import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { useVerifyEKYCMutation } from '@/features/profile/store/api/profileApi';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseVerifyKYCProps {
  kycId?: string;
  onSuccess?: () => void;
}

export const useVerifyKYC = ({ kycId, onSuccess }: UseVerifyKYCProps = {}) => {
  const [verifyEKYC, { isLoading: isVerifying }] = useVerifyEKYCMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');

  const handleOpenApprove = () => {
    setModalType('approve');
    setModalOpen(true);
  };

  const handleOpenReject = () => {
    setModalType('reject');
    setModalOpen(true);
  };

  const handleVerify = async (remarks?: string) => {
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
      setModalOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error verifying eKYC:', error);
      toast.error(error?.message || 'Failed to verify eKYC');
    }
  };

  return {
    modalOpen,
    setModalOpen,
    modalType,
    isVerifying,
    handleOpenApprove,
    handleOpenReject,
    handleVerify,
  };
};

export default useVerifyKYC;
