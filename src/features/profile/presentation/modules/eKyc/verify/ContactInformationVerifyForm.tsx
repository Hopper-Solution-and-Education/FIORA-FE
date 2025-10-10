'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Icons } from '@/components/Icon';
import { Card, CardContent } from '@/components/ui/card';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import {
  useGetProfileByUserIdQuery,
  useVerifyEKYCMutation,
} from '@/features/profile/store/api/profileApi';
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
      <div className="max-w-5xl mx-auto">
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

            {canVerify && (
              <DefaultSubmitButton
                isSubmitting={isVerifying}
                disabled={isVerifying}
                onSubmit={handleOpenApprove}
                submitTooltip="Approve eKYC"
                customButton={{
                  onClick: handleOpenReject,
                  tooltip: 'Reject eKYC',
                  icon: <Icons.close className="h-5 w-5" />,
                  variant: 'destructive',
                  disabled: isVerifying,
                }}
              />
            )}

            {!canVerify && eKYCData && (
              <div className="text-center text-sm text-muted-foreground py-4">
                This eKYC has already been{' '}
                {eKYCData.status === EKYCStatus.APPROVAL ? 'approved' : 'processed'}.
              </div>
            )}
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
