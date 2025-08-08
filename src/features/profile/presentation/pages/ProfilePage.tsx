'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/features/profile/store/api/profileApi';
import HopperLogo from '@public/images/logo.jpg';
import PersonalInfoForm from '../molecules/PersonalInfoForm';
import ProfileSidebar from '../organisms/ProfileSidebar';

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleSave = async (values: {
    name: string;
    email: string;
    phone?: string;
    birthday?: string;
    address?: string;
  }) => {
    await updateProfile({ name: values.name }).unwrap();
  };

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
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <PersonalInfoForm
              initialValues={{
                name: profile?.name ?? '',
                email: profile?.email ?? '',
              }}
              isLoading={isUpdating || isLoading}
              onSubmit={handleSave}
            />
          </div>

          <ProfileSidebar profileImageSrc={HopperLogo.src} brandLogoSrc={HopperLogo.src} />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
