'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useState } from 'react';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (currentPassword: string, newPassword: string) => void;
  isLoading?: boolean;
}

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    onConfirm(currentPassword, newPassword);
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onOpenChange(false);
  };

  const passwordsMatch = newPassword === confirmPassword;

  return (
    <GlobalDialog
      open={open}
      onOpenChange={(open) => {
        if (!isLoading) {
          if (!open) handleClose();
          else onOpenChange(open);
        }
      }}
      title="Change password"
      description="Enter your current password and set a new password for your account."
      variant="warning"
      type="info"
      hideCancel={true}
      hideConfirm={true}
      isLoading={isLoading}
      renderContent={() => (
        <div className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="text-sm"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
        </div>
      )}
      footer={
        <DefaultSubmitButton
          onBack={handleClose}
          onSubmit={handleConfirm}
          isSubmitting={isLoading}
          disabled={!currentPassword || !newPassword || !confirmPassword || !passwordsMatch}
          backTooltip="Cancel"
          submitTooltip="Confirm password change"
          className="mt-0"
        />
      }
    />
  );
};

export default ChangePasswordDialog;
