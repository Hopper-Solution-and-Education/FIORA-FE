'use client';
import { UpdateProfileRequest } from '@/features/profile/domain/entities/models/profile';
import {
  useGetProfileByUserIdQuery,
  useUpdateProfileByUserIdMutation,
} from '@/features/profile/store/api/profileApi';
import avatar from '@public/images/avatar.png';
import logo from '@public/images/logo.jpg';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { PersonalInfo } from '../../../schema/personalInfoSchema';
import ProfileTab from '../../profile/organisms/ProfileTab';
import ProfileTabsContainer from '../../profile/templates/ProfileTabsContainer';

const ProfileEkycPage = () => {
  const params = useParams();
  const userId = params?.userid as string;

  const { data: profile, isLoading } = useGetProfileByUserIdQuery(userId as string);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileByUserIdMutation();

  const handleSave = async (
    values: PersonalInfo & { avatarAttachmentId?: string; logoAttachmentId?: string },
  ) => {
    try {
      // Prepare JSON payload with attachment IDs
      const payload: UpdateProfileRequest = {
        name: values.name,
        phone: values.phone,
        address: values.address,
        birthday: values.birthday,
      };

      // Add attachment IDs if provided
      if (values.avatarAttachmentId) {
        (payload as any).avatarAttachmentId = values.avatarAttachmentId;
      }
      if (values.logoAttachmentId) {
        (payload as any).logoAttachmentId = values.logoAttachmentId;
      }

      await updateProfile({ userId, payload }).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log('🚀 ~ handleSave ~ error:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="px-8">
      <ProfileTabsContainer
        profileContent={
          <ProfileTab
            profile={profile}
            isLoading={isLoading}
            isUpdating={isUpdating}
            defaultLogoSrc={logo.src}
            defaultAvatarSrc={avatar.src}
            onSave={handleSave}
            eKycId={userId}
            showUserManagement={true}
          />
        }
        // settingContent={<SettingTab />}
      />
    </div>
  );
};

export default ProfileEkycPage;
