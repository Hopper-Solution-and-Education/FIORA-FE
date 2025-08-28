'use client';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/features/profile/store/api/profileApi';
import HopperLogo from '@public/images/logo.jpg';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PersonalInfo } from '../molecules/PersonalInfoForm';
import ProfileTab from '../organisms/ProfileTab';
import SettingTab from '../organisms/SettingTab';
import ProfileTabsContainer from '../templates/ProfileTabsContainer';

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating, isSuccess }] = useUpdateProfileMutation();
  const [newProfileImages, setNewProfileImages] = useState({
    avatarImage: null as File | null,
    logoImage: null as File | null,
  });

  const { data: eKYCData } = useGetEKYCQuery();
  console.log('🚀 ~ ProfilePage ~ eKYCData:', eKYCData);

  const handleSave = async (values: PersonalInfo) => {
    const formData = new FormData();
    if (values.name) formData.append('name', values.name);
    if (values.phone) formData.append('phone', values.phone);
    if (values.address) formData.append('address', values.address);
    if (values.birthday) formData.append('birthday', values.birthday);
    if (newProfileImages.avatarImage) formData.append('newAvatar', newProfileImages.avatarImage);
    if (newProfileImages.logoImage) formData.append('newLogo', newProfileImages.logoImage);

    await updateProfile(formData).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile updated successfully');
    }
  }, [isSuccess]);

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
            onNewImagesChange={setNewProfileImages}
          />
        }
        settingContent={<SettingTab />}
      />
    </div>
  );
};

export default ProfilePage;
