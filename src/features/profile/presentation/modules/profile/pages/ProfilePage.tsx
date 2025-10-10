'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { UserBlockAction } from '../molecules/UserBlockAction';
import { UserRoleSelector } from '../molecules/UserRoleSelector';
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
    } catch (error) {
      console.log('🚀 ~ handleSave ~ error:', error);
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
      {/* User Management Testing Panel */}
      <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">User Management Testing Panel</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <Input
                type="text"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="w-full"
                placeholder="Enter a valid user ID"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setBlockDialogOpen(true)} variant="destructive">
              Test Block User
            </Button>
            <Button onClick={() => setRoleDialogOpen(true)} variant="outline">
              Test Change Role
            </Button>
          </div>
        </div>
      </div>

      {/* Include the dialog components */}
      <UserBlockAction
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        action="block"
        userId={testUserId}
        userName={testUserName || testUserId}
        onConfirm={handleBlockUser}
      />

      <UserBlockAction
        open={unblockDialogOpen}
        onOpenChange={setUnblockDialogOpen}
        action="unblock"
        userId={testUserId}
        userName={testUserName || testUserId}
        onConfirm={handleBlockUser}
      />

      <UserRoleSelector
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        userId={testUserId}
        currentRole={testUserRole}
        userName={testUserName || testUserId}
        onRoleUpdate={handleRoleUpdate}
        currentUserRole={profile?.role || UserRole.User}
      />
    </div>
  );
};

export default ProfilePage;
