'use client';
import UploadImageField from '@/components/common/forms/upload/UploadImageField';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { KYC_ITEMS } from '@/features/profile/constant';
import { EKYCType, UserProfile } from '@/features/profile/domain/entities/models/profile';
import {
  useAssignRoleMutation,
  useBlockUserMutation,
  useGetMyProfileQuery,
  useUploadAttachmentMutation,
  useVerifyReferralCodeMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PersonalInfo, personalInfoSchema } from '../../../schema/personalInfoSchema';
import PersonalInfoFields from '../molecules/PersonalInfoFields';
import { UserManagementActions } from '../molecules/UserManagementActions';
import KYCSection from './KYCSection';

type ProfileTabProps = {
  profile: UserProfile | null | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  defaultLogoSrc: string;
  defaultAvatarSrc: string;
  onSave: (
    values: PersonalInfo & { avatarAttachmentId?: string; logoAttachmentId?: string },
  ) => Promise<void>;
  eKycId?: string;
  showUserManagement?: boolean;
};

const ProfileTab: FC<ProfileTabProps> = ({
  profile,
  isLoading,
  isUpdating,
  defaultLogoSrc,
  defaultAvatarSrc,
  onSave,
  eKycId = '',
  showUserManagement,
}) => {
  const router = useRouter();
  const params = useParams(); // Lấy dynamic parameters từ URL
  const { data: session } = useSession(); // Lấy session của user đang đăng nhập
  const [assignRole] = useAssignRoleMutation();
  const [blockUser] = useBlockUserMutation();

  // Lấy ID từ URL: /ekyc/[id]/profile
  const userIdFromUrl = params?.userid as string;

  showUserManagement = userIdFromUrl !== session?.user?.id;
  // Lấy myProfile data từ API
  const { data: myProfile } = useGetMyProfileQuery(profile?.id || '', {
    skip: !profile?.id, // Chỉ gọi API khi có userId
  });

  // Check xem current user có phải Admin không
  const isCurrentUserAdmin = session?.user?.role === UserRole.Admin;

  const [isBlocked, setIsBlocked] = useState(myProfile?.isBlocked || false);
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();
  const [verifyReferralCode] = useVerifyReferralCodeMutation();

  const defaults = useMemo(
    () => ({
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      birthday: profile?.birthday ?? '',
      address: profile?.address ?? '',
      avatarUrl: profile?.avatarUrl ?? defaultAvatarSrc,
      logoUrl: profile?.logoUrl ?? defaultLogoSrc,
      referrer_code: profile?.referrer_code ?? '',
    }),
    [profile, defaultLogoSrc, defaultAvatarSrc],
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
    watch,
  } = form;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  // Update isBlocked state khi myProfile data thay đổi
  useEffect(() => {
    if (myProfile?.isBlocked !== undefined) {
      setIsBlocked(myProfile.isBlocked);
    }
  }, [myProfile?.isBlocked]);

  const convertBlobUrlToFile = async (blobUrl: string, fileName: string): Promise<File> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const uploadFile = async (
    file: File,
    fileType: string,
  ): Promise<{ url: string; fileName: string; attachmentId: string } | null> => {
    try {
      const fileName = `profile-${fileType}-${Date.now()}`;
      const downloadURL = await uploadToFirebase({
        file,
        path: 'profile-images',
        fileName,
      });

      // Create attachment
      const attachmentResponse = await uploadAttachmentMutation({
        url: downloadURL,
        path: fileName,
        type: 'image',
      });

      if (!attachmentResponse?.data?.id) {
        throw new Error('Failed to create attachment');
      }

      return {
        url: downloadURL,
        fileName: fileName,
        attachmentId: attachmentResponse.data.id,
      };
    } catch (error) {
      console.error(`Error uploading ${fileType} file:`, error);
      toast.error(`Failed to upload ${fileType}`);
      return null;
    }
  };

  const handleSubmitForm = async (values: PersonalInfo) => {
    try {
      // Validate referral code if it's new (changed) and not empty
      const currentReferrerCode = profile?.referrer_code?.trim() || '';
      const newReferrerCode = values.referrer_code?.trim() || '';

      if (newReferrerCode && newReferrerCode !== currentReferrerCode) {
        // Call verify API using RTK Query
        try {
          const verifyResult = await verifyReferralCode({
            referralCode: newReferrerCode,
          }).unwrap();

          toast.success(
            `Referral code verified! Referred by ${verifyResult.referrerName || 'user'}`,
          );
        } catch (error: any) {
          toast.error(error?.data?.message || 'Invalid referral code');
          return;
        }
      }

      const avatarValue = watch('avatarUrl');
      const logoValue = watch('logoUrl');

      let avatarAttachmentId: string | undefined;
      let logoAttachmentId: string | undefined;

      // Upload avatar if it's a blob URL (new file)
      if (avatarValue && avatarValue.startsWith('blob:')) {
        const avatarFile = await convertBlobUrlToFile(avatarValue, 'avatar.png');
        const avatarResult = await uploadFile(avatarFile, 'avatar');
        if (avatarResult) {
          avatarAttachmentId = avatarResult.attachmentId;
        }
      }

      // Upload logo if it's a blob URL (new file)
      if (logoValue && logoValue.startsWith('blob:')) {
        const logoFile = await convertBlobUrlToFile(logoValue, 'logo.jpg');
        const logoResult = await uploadFile(logoFile, 'logo');
        if (logoResult) {
          logoAttachmentId = logoResult.attachmentId;
        }
      }

      // Prepare payload with attachment IDs
      const payload = {
        ...values,
        avatarAttachmentId,
        logoAttachmentId,
        // Remove avatarUrl and logoUrl if we have attachment IDs
        avatarUrl: avatarAttachmentId ? undefined : values.avatarUrl,
        logoUrl: logoAttachmentId ? undefined : values.logoUrl,
      };

      await onSave(payload);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  const handleNavigateToKYC = (id: string) => {
    const navigateUrl = eKycId ? `/ekyc/${eKycId}/verify?id=${id}` : `/profile/ekyc?id=${id}`;

    router.push(navigateUrl);
  };

  const getEKYCStatus = (type: EKYCType) => {
    return profile?.eKYC?.find((item) => item.type === type)?.status;
  };

  // Handler for role updates
  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      await assignRole({ assignUserId: userId, role: newRole }).unwrap();
      toast.success('User role updated successfully');
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error?.data?.message || 'Failed to update user role');
      throw error;
    }
  };

  // Handler for block user
  const handleBlockUser = async (userId: string, reason?: string) => {
    try {
      const resulBlockUser = await blockUser({ blockUserId: userId, reason }).unwrap();
      toast.success(resulBlockUser?.message);
      setIsBlocked(resulBlockUser?.data?.isBlocked || false);
    } catch (error: any) {
      console.error('Error blocking user:', error);
      toast.error(error?.data?.message);
      throw error;
    }
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
              onNavigateToKYC={() => handleNavigateToKYC(KYC_ITEMS.CONTACT_INFORMATION.route)}
              status={getEKYCStatus(EKYCType.CONTACT_INFORMATION)}
            />

            <PersonalInfoFields
              control={control}
              hasReferrerCode={!!profile?.referrer_code && profile.referrer_code.trim().length > 0}
            />

            <KYCSection
              title="Identification Document"
              description="Verify your identity with government-issued documents to unlock full account features and ensure security"
              kycType={EKYCType.IDENTIFICATION_DOCUMENT}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_ITEMS.IDENTIFICATION_DOCUMENT.route)}
              status={getEKYCStatus(EKYCType.IDENTIFICATION_DOCUMENT)}
              eKycId={eKycId}
            />

            <KYCSection
              title="Tax Information"
              description="Provide your tax details for compliance and to receive proper tax reporting for your transactions"
              kycType={EKYCType.TAX_INFORMATION}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_ITEMS.TAX_INFORMATION.route)}
              status={getEKYCStatus(EKYCType.TAX_INFORMATION)}
              eKycId={eKycId}
            />

            <KYCSection
              title="Bank Account"
              description="Connect your bank account for secure transactions, instant transfers, and seamless financial management"
              kycType={EKYCType.BANK_ACCOUNT}
              onNavigateToKYC={() => handleNavigateToKYC(KYC_ITEMS.BANK_ACCOUNT.route)}
              status={getEKYCStatus(EKYCType.BANK_ACCOUNT)}
              eKycId={eKycId}
            />

            {/* {showUserManagement && currentUserRole === UserRole.Admin && ( */}
            {showUserManagement && isCurrentUserAdmin && (
              <UserManagementActions
                userId={profile?.id || ''}
                userEmail={profile?.email || ''}
                userName={profile?.name || ''}
                currentRole={profile?.role}
                currentUserRole={profile?.role || UserRole.User}
                onRoleUpdate={handleRoleUpdate}
                onBlockUser={handleBlockUser}
                isBlocked={isBlocked}
              />
            )}

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
