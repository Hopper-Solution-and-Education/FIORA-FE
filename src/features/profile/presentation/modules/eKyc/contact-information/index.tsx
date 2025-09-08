'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { eKYC } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';
import {
  ContactInfoActions,
  ContactInfoForm,
  ContactInfoHeader,
  OtpVerificationModal,
} from './components';
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
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        <ContactInfoHeader status={eKYCData?.status} />

        <div className="space-y-4 sm:space-y-6">
          <ContactInfoForm
            profile={profile}
            isSendingOtp={isSendingOtp}
            isLoadingProfile={isLoadingProfile}
            eKYCData={eKYCData}
            onSendOtp={onSendOtp}
          />

          <ContactInfoActions isLoading={isSendingOtp} />
        </div>

        <OtpVerificationModal
          otpModal={otpModal}
          onOtpModalChange={handleOtpModalChange}
          onClose={handleCloseOtpModal}
          onVerify={handleVerifyOtp}
          onResend={onResendOtp}
        />
      </div>
    </TooltipProvider>
  );
};

export default ContactInformationForm;
