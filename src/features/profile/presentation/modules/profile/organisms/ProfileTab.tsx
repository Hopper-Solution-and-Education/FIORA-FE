'use client';
import { FC, useState } from 'react';
import PersonalInfoForm from './PersonalInfoForm';
import ProfileSidebar from './ProfileSidebar';

import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { PersonalInfo } from '../../../schema/personalInfoSchema';

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
  const [isImageUpdated, setIsImageUpdated] = useState(false);

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <PersonalInfoForm
          isLoading={isUpdating || isLoading}
          onSubmit={async (values) => {
            onSave(values);
            setIsImageUpdated(false);
          }}
          profile={profile}
          isImageUpdated={isImageUpdated}
        />
      </div>

      <ProfileSidebar
        initialImages={{
          avatarUrl: profile?.avatarUrl ?? defaultLogoSrc,
          logoUrl: profile?.logoUrl ?? defaultLogoSrc,
        }}
        setNewImages={onNewImagesChange}
        disabled={isUpdating}
        setIsImageUpdated={setIsImageUpdated}
      />
    </div>
  );
};

export default ProfileTab;
