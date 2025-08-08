'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/features/profile/store/api/profileApi';
import HopperLogo from '@public/images/logo.jpg';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PersonalInfoForm from '../molecules/PersonalInfoForm';
import ProfileSidebar from '../organisms/ProfileSidebar';

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating, isSuccess }] = useUpdateProfileMutation();

  const [newProfileImages, setNewProfileImages] = useState({
    avatarImage: null as File | null,
    logoImage: null as File | null,
  });

  const handleSave = async (values: {
    name: string;
    email: string;
    phone?: string;
    birthday?: string;
    address?: string;
  }) => {
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
      <div className="bg-white shadow-sm border-b border-gray-200">
        <Tabs defaultValue="profile">
          <TabsList className="bg-transparent border-b-2 border-gray-200 h-auto p-0">
            <TabsTrigger
              value="profile"
              className="text-base font-semibold text-gray-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-2"
            >
              My Profile
            </TabsTrigger>
            <TabsTrigger
              value="setting"
              className="text-base font-semibold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-2"
            >
              Setting
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <main>
        {profile && (
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
                onSubmit={handleSave}
              />
            </div>

            <ProfileSidebar
              initialImages={{
                avatarUrl: profile?.avatarUrl ?? HopperLogo.src,
                logoUrl: profile?.logoUrl ?? HopperLogo.src,
              }}
              setNewImages={setNewProfileImages}
              disabled={isUpdating}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
