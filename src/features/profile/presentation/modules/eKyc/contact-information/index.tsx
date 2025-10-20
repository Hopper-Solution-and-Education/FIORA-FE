'use client';

import { Card } from '@/components/ui/card';
import { eKYC } from '@/features/profile/domain/entities/models/profile';
import { MessageSquare } from 'lucide-react';
import { FC, Fragment } from 'react';
import { EKYCTabActions, FormHeader } from '../shared/components';
import { ContactInfoForm, OtpVerificationModal } from './components';
import { useContactInfoForm } from './hooks';

type Props = {
  eKYCData: eKYC;
};

const ContactInformationForm: FC<Props> = ({ eKYCData }) => {
  const {
    otpModal,
    isSendingOtp,
    isLoadingProfile,
    profile,
    handleCloseOtpModal,
    handleVerifyOtp,
    handleOtpModalChange,
    onSendOtp,
    onResendOtp,
  } = useContactInfoForm();

  return (
    <Fragment>
      <div className="mx-auto">
        <FormHeader
          icon={MessageSquare}
          title="Contact Information"
          description="Verify your email and phone number for account security"
          iconColor="text-blue-600"
          status={eKYCData?.status}
        />

        <Card>
          <div className="space-y-4 sm:space-y-6 p-6">
            <ContactInfoForm
              profile={profile}
              isSendingOtp={isSendingOtp}
              isLoadingProfile={isLoadingProfile}
              eKYCData={eKYCData}
              onSendOtp={onSendOtp}
            />
          </div>
        </Card>

        <OtpVerificationModal
          otpModal={otpModal}
          onOtpModalChange={handleOtpModalChange}
          onClose={handleCloseOtpModal}
          onVerify={handleVerifyOtp}
          onResend={onResendOtp}
        />
      </div>
      <EKYCTabActions isLoading={isSendingOtp} showSubmitButton={false} />
    </Fragment>
  );
};

export default ContactInformationForm;
