'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, ReactNode } from 'react';

type ProfileTabsContainerProps = {
  defaultValue?: string;
  profileContent: ReactNode;
  settingContent: ReactNode;
};

const ProfileTabsContainer: FC<ProfileTabsContainerProps> = ({
  defaultValue = 'profile',
  profileContent,
  settingContent,
}) => {
  return (
    <div className="bg-white shadow-sm ">
      <Tabs defaultValue={defaultValue}>
        <TabsList className="bg-transparent h-auto p-0">
          <TabsTrigger
            value="profile"
            className="text-base font-semibold text-gray-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none  data-[state=active]:border-b-2  rounded-none pb-2"
          >
            My Profile
          </TabsTrigger>
          <TabsTrigger
            value="setting"
            className="text-base font-semibold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2  rounded-none pb-2"
          >
            Setting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <main>{profileContent}</main>
        </TabsContent>

        <TabsContent value="setting" className="mt-0">
          <main>{settingContent}</main>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabsContainer;
