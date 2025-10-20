'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Card, CardContent } from '@/components/ui/card';
import { eKYC } from '@/features/profile/domain/entities/models/profile';
import { useGetProfileByUserIdQuery } from '@/features/profile/store/api/profileApi';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { ContactInfoForm } from '../contact-information/components';
import { FormHeader } from '../shared/components';

interface ContactInformationVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
  onApprove?: () => void;
  onReject?: () => void;
  isVerifying?: boolean;
}

const ContactInformationVerifyForm: FC<ContactInformationVerifyFormProps> = ({
  eKYCData,
  userId,
}) => {
  const router = useRouter();
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileByUserIdQuery(userId, {
    skip: !userId,
  });

  return (
    <div className="max-w-5xl mx-auto">
      <FormHeader
        icon={MessageSquare}
        title="Contact Information"
        description="Verify your email and phone number for account security"
        iconColor="text-blue-600"
        status={eKYCData?.status}
      />

      <Card>
        <CardContent className="p-6">
          <ContactInfoForm
            profile={profile}
            isSendingOtp={false}
            isLoadingProfile={isLoadingProfile}
            eKYCData={eKYCData}
            onSendOtp={() => {}}
          />

          <DefaultSubmitButton onBack={() => router.back()} backTooltip="Go back" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInformationVerifyForm;
