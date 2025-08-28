'use client';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import {
  EKYCStatus,
  EKYCType,
  UserProfile,
} from '@/features/profile/domain/entities/models/profile';
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
};

export const PersonalInfoForm: FC<Props> = ({ isLoading, onSubmit, profile }) => {
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
    formState: { isSubmitting, isValid },
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

  const eKYCVerified = useMemo(() => {
    const isVerified = (type: EKYCType) => {
      return profile?.eKYC?.some(
        (item) => item.type === type && item.status === EKYCStatus.APPROVAL,
      );
    };
    return {
      contactInformation: isVerified(EKYCType.CONTACT_INFORMATION),
      identificationDocument: isVerified(EKYCType.IDENTIFICATION_DOCUMENT),
      taxInformation: isVerified(EKYCType.TAX_INFORMATION),
      bankAccount: isVerified(EKYCType.BANK_ACCOUNT),
    };
  }, [profile]);

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
          isVerified={eKYCVerified.contactInformation}
        />

        <PersonalInfoFields control={control} />

        <KYCSection
          title="Identification Document"
          description="Verify your identity with government-issued documents to unlock full account features and ensure security"
          kycType="identification-document"
          onNavigateToKYC={handleNavigateToKYC}
        />

        <KYCSection
          title="Tax Information"
          description="Provide your tax details for compliance and to receive proper tax reporting for your transactions"
          kycType="tax-information"
          onNavigateToKYC={handleNavigateToKYC}
          className="mb-4"
        />

        <KYCSection
          title="Bank Account"
          description="Connect your bank account for secure transactions, instant transfers, and seamless financial management"
          kycType="bank-account"
          onNavigateToKYC={handleNavigateToKYC}
        />

        <DefaultSubmitButton
          isSubmitting={isLoading || isSubmitting}
          disabled={!isValid || isSubmitting || isLoading}
          onSubmit={() => handleSubmitForm(getValues())}
          onBack={() => history.back()}
        />
      </form>
    </FormProvider>
  );
};

export default PersonalInfoForm;
