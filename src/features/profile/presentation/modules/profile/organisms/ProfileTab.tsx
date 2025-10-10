'use client';
import UploadImageField from '@/components/common/forms/upload/UploadImageField';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { KYC_TABS } from '@/features/profile/constant';
import { EKYCType, UserProfile } from '@/features/profile/domain/entities/models/profile';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { PersonalInfo, personalInfoSchema } from '../../../schema/personalInfoSchema';
import KYCSection from '../molecules/KYCSection';
import PersonalInfoFields from '../molecules/PersonalInfoFields';
import { UserManagementActions } from '../molecules/UserManagementActions';

type ProfileTabProps = {
  profile: UserProfile | null | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  defaultLogoSrc: string;
  onSave: (values: PersonalInfo) => Promise<void>;
  eKycId?: string;
};

const ProfileTab: FC<ProfileTabProps> = ({
  profile,
  isLoading,
  isUpdating,
  defaultLogoSrc,
  onSave,
  eKycId = '',
}) => {
  const router = useRouter();

  const defaults = useMemo(
    () => ({
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      birthday: profile?.birthday ?? '',
      address: profile?.address ?? '',
      avatarUrl: profile?.avatarUrl ?? defaultLogoSrc,
      logoUrl: profile?.logoUrl ?? defaultLogoSrc,
    }),
    [profile, defaultLogoSrc],
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
    handleSubmit,
  } = form;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const handleSubmitForm = async (values: PersonalInfo) => {
    await onSave(values);
  };

  const handleNavigateToKYC = (id: string) => {
    const navigateUrl = eKycId ? `/ekyc/${eKycId}/verify?id=${id}` : `/profile/ekyc?id=${id}`;

    router.push(navigateUrl);
  };

  const getEKYCStatus = (type: EKYCType) => {
    return profile?.eKYC?.find((item) => item.type === type)?.status;
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg py-6 lg:py-8">
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          noValidate
          className="flex flex-col lg:flex-row gap-8 justify-between"
        >
          <div className="flex-1">
            <KYCSection
              title="Personal Information"
              description="Update your personal details"
              kycType={EKYCType.CONTACT_INFORMATION}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_TABS.CONTACT_INFORMATION)}
              status={getEKYCStatus(EKYCType.CONTACT_INFORMATION)}
            />

            <PersonalInfoFields control={control} />

            <KYCSection
              title="Identification Document"
              description="Verify your identity with government-issued documents to unlock full account features and ensure security"
              kycType={EKYCType.IDENTIFICATION_DOCUMENT}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_TABS.IDENTIFICATION_DOCUMENT)}
              status={getEKYCStatus(EKYCType.IDENTIFICATION_DOCUMENT)}
            />

            <KYCSection
              title="Tax Information"
              description="Provide your tax details for compliance and to receive proper tax reporting for your transactions"
              kycType={EKYCType.TAX_INFORMATION}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_TABS.TAX_INFORMATION)}
              status={getEKYCStatus(EKYCType.TAX_INFORMATION)}
            />

            <KYCSection
              title="Bank Account"
              description="Connect your bank account for secure transactions, instant transfers, and seamless financial management"
              kycType={EKYCType.BANK_ACCOUNT}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_TABS.BANK_ACCOUNT)}
              status={getEKYCStatus(EKYCType.BANK_ACCOUNT)}
            />
            <UserManagementActions
              userId={profile?.id || ''}
              userName={profile?.name || ''}
              currentRole={profile?.role}
              currentUserRole={profile?.role || UserRole.User}
              onRoleUpdate={undefined}
              onBlockUser={undefined}
              onUnblockUser={undefined}
              isBlocked={false}
            />

            <DefaultSubmitButton
              isSubmitting={isLoading || isSubmitting}
              disabled={isSubmitting || isLoading || !isDirty}
              onSubmit={handleSubmit(handleSubmitForm)}
              onBack={() => history.back()}
            />
          </div>

          <div className="w-full lg:w-1/4 ">
            <div className="space-y-6 w-full">
              <div className="bg-white rounded-lg text-center">
                <Controller
                  name="avatarUrl"
                  control={control}
                  render={({ field }) => (
                    <UploadImageField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      label="Profile Picture"
                      placeholder="Choose profile picture"
                      previewShape="circle"
                      size="medium"
                      disabled={isUpdating}
                      className="mx-auto"
                      canChangeShape={false}
                    />
                  )}
                />
              </div>

              <div className="bg-white rounded-lg text-center">
                <Controller
                  name="logoUrl"
                  control={control}
                  render={({ field }) => (
                    <UploadImageField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      label="Brand Logo"
                      placeholder="Choose brand logo"
                      previewShape="circle"
                      size="medium"
                      disabled={isUpdating}
                      className="mx-auto"
                      canChangeShape={false}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProfileTab;
