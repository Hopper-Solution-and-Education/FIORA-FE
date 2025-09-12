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

  const handleSave = async (values: PersonalInfo) => {
    const convertToFile = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: blob.type });
      return file;
    };

    try {
      const formData = new FormData();
      if (values.name) formData.append('name', values.name);
      if (values.phone) formData.append('phone', values.phone);
      if (values.address) formData.append('address', values.address);
      if (values.birthday) formData.append('birthday', values.birthday);

      // Handle avatar URL - check if it's a blob URL (new file) or existing URL
      if (values.avatarUrl && values.avatarUrl.startsWith('blob:')) {
        // Convert blob URL to File object and append to FormData
        try {
          const file = await convertToFile(values.avatarUrl);
          formData.append('newAvatar', file);
        } catch (error) {
          console.warn('Failed to convert avatar blob to file:', error);
        }
      }

      // Handle logo URL - check if it's a blob URL (new file) or existing URL
      if (values.logoUrl && values.logoUrl.startsWith('blob:')) {
        // Convert blob URL to File object and append to FormData
        try {
          const file = await convertToFile(values.logoUrl);
          formData.append('newLogo', file);
        } catch (error) {
          console.warn('Failed to convert logo blob to file:', error);
        }
      }

      await updateProfile(formData).unwrap();
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
            defaultLogoSrc={HopperLogo.src}
            onSave={handleSave}
          />
        }
        settingContent={<SettingTab />}
      />
    </div>
  );
};

export default ProfilePage;
