'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Card, CardContent } from '@/components/ui/card';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import {
  useGetProfileByUserIdQuery,
  useVerifyEKYCMutation,
} from '@/features/profile/store/api/profileApi';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { ContactInfoForm, ContactInfoHeader } from '../contact-information/components';
import { VerifyConfirmModal } from './components';

interface ContactInformationVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
}

const ContactInformationVerifyForm: FC<ContactInformationVerifyFormProps> = ({
  eKYCData,
  userId,
}) => {
  const router = useRouter();
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileByUserIdQuery(userId, {
    skip: !userId,
  });
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
    if (!eKYCData?.id) {
      toast.error('eKYC data not found');
      return;
    }

    try {
      const status = modalType === 'approve' ? EKYCStatus.APPROVAL : EKYCStatus.REJECTED;
      await verifyEKYC({
        kycId: eKYCData.id,
        status,
        remarks: remarks || '',
      }).unwrap();

      toast.success(
        modalType === 'approve' ? 'eKYC approved successfully' : 'eKYC rejected successfully',
      );
      setModalOpen(false);
    } catch (error: any) {
      console.error('Error verifying eKYC:', error);
      toast.error(error?.message || 'Failed to verify eKYC');
    }
  };

  const canVerify = eKYCData?.status === EKYCStatus.PENDING;

  return (
    <>
      <div className="mx-auto">
        <ContactInfoHeader status={eKYCData?.status} />

        <Card>
          <CardContent className="p-6">
            <ContactInfoForm
              profile={profile}
              isSendingOtp={false}
              isLoadingProfile={isLoadingProfile}
              eKYCData={eKYCData}
              onSendOtp={() => {}}
            />

            <DefaultSubmitButton
              onBack={() => {
                router.back();
              }}
              backTooltip="Go back"
            />
          </CardContent>
        </Card>
      </div>

      <VerifyConfirmModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
        onConfirm={handleVerify}
        isLoading={isVerifying}
      />
    </>
  );
};

export default ContactInformationVerifyForm;
