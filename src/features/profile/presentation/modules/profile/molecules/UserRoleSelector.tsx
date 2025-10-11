'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserRole } from '@prisma/client';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { RoleSelect } from '../atoms/RoleSelect';
import { UserInfo } from '../atoms/UserInfo';

interface UserRoleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  currentRole?: UserRole;
  userName?: string;
  userEmail?: string;
  onRoleUpdate?: (userId: string, newRole: UserRole) => Promise<void>;
  currentUserRole?: UserRole;
}

export function UserRoleSelector({
  open,
  onOpenChange,
  userId,
  currentRole,
  userName,
  userEmail,
  onRoleUpdate,
  currentUserRole = UserRole.User,
}: UserRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || UserRole.User);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleUpdate = async () => {
    if (!userId || !onRoleUpdate || selectedRole === currentRole) return;

    setIsLoading(true);
    try {
      await onRoleUpdate(userId, selectedRole);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedRole(currentRole || UserRole.User);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-center font-semibold">Assign Role</DialogTitle>
          <DialogDescription className="text-center text-base mt-4 max-w-2xl">
            Select a new role to assign to this user. Changing a user&apos;s role will update their
            permissions immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <UserInfo label="Name" value={userName || '-'} />
          <UserInfo label="Email" value={userEmail || '-'} />

          <RoleSelect selectedRole={selectedRole} onRoleChange={setSelectedRole} />
        </div>

        <DialogFooter className="flex items-center justify-between gap-6 mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-14 rounded-lg flex items-center justify-center"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <Button
            onClick={handleRoleUpdate}
            disabled={isLoading || selectedRole === currentRole}
            className="flex-1 h-14 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            {isLoading ? (
              'Updating...'
            ) : (
              <>
                <Check className="h-5 w-5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
