'use client';
import { httpClient } from '@/config';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '@/features/profile/store/api/profileApi';
import { UserRole } from '@prisma/client';
import HopperLogo from '@public/images/logo.jpg';
import { useState } from 'react';
import { toast } from 'sonner';
import { PersonalInfo } from '../../../schema/personalInfoSchema';
import ProfileTab from '../organisms/ProfileTab';
import SettingTab from '../organisms/SettingTab';
import ProfileTabsContainer from '../templates/ProfileTabsContainer';

const ProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // User management state
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [testUserId, setTestUserId] = useState('');
  const [testUserName, setTestUserName] = useState('');
  const [testUserRole, setTestUserRole] = useState<UserRole>(UserRole.User);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // Handler for blocking users
  const handleBlockUser = async (userId: string, reason?: string) => {
    try {
      const action = unblockDialogOpen ? 'unblock' : 'block';

      const response = await httpClient.put('/api/profile/block', {
        blockUserId: userId,
        reason: reason,
      });

      toast.success(`User ${action}ed successfully`);

      if (blockDialogOpen) setBlockDialogOpen(false);
      if (unblockDialogOpen) setUnblockDialogOpen(false);

      return Promise.resolve();
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      toast.error('Failed to update user status');
      return Promise.reject(error);
    }
  };

  // Handler for role updates
  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      const response = await httpClient.put('/api/profile/assign-role', {
        assignUserId: userId,
        role: newRole,
      });

      toast.success('User role updated successfully');
      setTestUserRole(newRole);

      return Promise.resolve();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
      return Promise.reject(error);
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
