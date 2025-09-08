'use client';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { EKYCType, UserProfile } from '@/features/profile/domain/entities/models/profile';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { personalInfoSchema } from '../../../schema/personalInfoSchema';
import KYCSection from '../molecules/KYCSection';
import PersonalInfoFields, { PersonalInfo } from '../molecules/PersonalInfoFields';

type Props = {
  isLoading?: boolean;
  onSubmit: (values: PersonalInfo) => void;
  profile: UserProfile;
  isImageUpdated: boolean;
};

export const PersonalInfoForm: FC<Props> = ({ isLoading, onSubmit, profile, isImageUpdated }) => {
  const router = useRouter();

  const defaults = useMemo<PersonalInfo>(
    () => ({
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      birthday: profile?.birthday ?? '',
      address: profile?.address ?? '',
    }),
    [profile],
  );

  const form = useForm<PersonalInfo>({
    resolver: yupResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: defaults,
  });

  const {
    control,
    reset,
    formState: { isSubmitting, isDirty },
    getValues,
  } = form;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const handleSubmitForm = (values: PersonalInfo) => {
    onSubmit(values);
  };

  const handleNavigateToKYC = (id: string) => {
    router.push(`/profile/ekyc?id=${id}`);
  };

  const getEKYCStatus = (type: EKYCType) => {
    return profile?.eKYC?.find((item) => item.type === type)?.status;
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm(getValues());
        }}
        noValidate
      >
        <KYCSection
          title="Personal Information"
          description="Update your personal details"
          kycType="contact-information"
          onNavigateToKYC={handleNavigateToKYC}
          status={getEKYCStatus(EKYCType.CONTACT_INFORMATION)}
        />

        <PersonalInfoFields control={control} />

        <KYCSection
          title="Identification Document"
          description="Verify your identity with government-issued documents to unlock full account features and ensure security"
          kycType="identification-document"
          onNavigateToKYC={handleNavigateToKYC}
          status={getEKYCStatus(EKYCType.IDENTIFICATION_DOCUMENT)}
        />

        <KYCSection
          title="Tax Information"
          description="Provide your tax details for compliance and to receive proper tax reporting for your transactions"
          kycType="tax-information"
          onNavigateToKYC={handleNavigateToKYC}
          className="mb-4"
          status={getEKYCStatus(EKYCType.TAX_INFORMATION)}
        />

        <KYCSection
          title="Bank Account"
          description="Connect your bank account for secure transactions, instant transfers, and seamless financial management"
          kycType="bank-account"
          onNavigateToKYC={handleNavigateToKYC}
          status={getEKYCStatus(EKYCType.BANK_ACCOUNT)}
        />

        <DefaultSubmitButton
          isSubmitting={isLoading || isSubmitting}
          disabled={isSubmitting || isLoading || (!isDirty && !isImageUpdated)}
          onSubmit={() => handleSubmitForm(getValues())}
          onBack={() => history.back()}
        />
      </form>
    </FormProvider>
  );
};

export default PersonalInfoForm;
