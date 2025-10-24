'use client';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/features/profile/store/api/profileApi';
import HopperLogo from '@public/images/logo.jpg';
import { toast } from 'sonner';
import { PersonalInfo } from '../../../schema/personalInfoSchema';
import ProfileTab from '../organisms/ProfileTab';
import SettingTab from '../organisms/SettingTab';
import ProfileTabsContainer from '../templates/ProfileTabsContainer';

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleSave = async (
    values: PersonalInfo & { avatarAttachmentId?: string; logoAttachmentId?: string },
  ) => {
    try {
      // Prepare JSON payload with attachment IDs
      const payload: any = {
        name: values.name,
        phone: values.phone,
        address: values.address,
        birthday: values.birthday,
        referrer_code: values.referrer_code,
      };

      // Add attachment IDs if provided
      if (values.avatarAttachmentId) {
        payload.avatarAttachmentId = values.avatarAttachmentId;
      }
      if (values.logoAttachmentId) {
        payload.logoAttachmentId = values.logoAttachmentId;
      }

      await updateProfile(payload).unwrap();
      toast.success('Profile updated successfully');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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
            defaultLogoSrc={HopperLogo.src}
            onSave={handleSave}
          />
        }
        settingContent={<SettingTab profile={profile} />}
      />
    </div>
  );
};

export default ProfilePage;
