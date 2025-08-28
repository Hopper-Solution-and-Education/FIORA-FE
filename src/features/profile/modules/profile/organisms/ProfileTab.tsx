'use client';
import { FC } from 'react';
import PersonalInfoForm, { PersonalInfo } from '../molecules/PersonalInfoForm';
import ProfileSidebar from './ProfileSidebar';

import { UserProfile } from '../../../store/api/profileApi';

type ProfileTabProps = {
  profile: UserProfile | null | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  defaultLogoSrc: string;
  onSave: (values: PersonalInfo) => Promise<void>;
  onNewImagesChange: React.Dispatch<
    React.SetStateAction<{ avatarImage: File | null; logoImage: File | null }>
  >;
};

const ProfileTab: FC<ProfileTabProps> = ({
  profile,
  isLoading,
  isUpdating,
  defaultLogoSrc,
  onSave,
  onNewImagesChange,
}) => {
  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <PersonalInfoForm
          initialValues={{
            name: profile?.name ?? '',
            email: profile?.email ?? '',
            birthday: profile?.birthday ?? '',
            address: profile?.address ?? '',
            phone: profile?.phone ?? '',
          }}
          isLoading={isUpdating || isLoading}
          onSubmit={onSave}
        />
      </div>

      <ProfileSidebar
        initialImages={{
          avatarUrl: profile?.avatarUrl ?? defaultLogoSrc,
          logoUrl: profile?.logoUrl ?? defaultLogoSrc,
        }}
        setNewImages={onNewImagesChange}
        disabled={isUpdating}
      />
    </div>
  );
};

export default ProfileTab;
