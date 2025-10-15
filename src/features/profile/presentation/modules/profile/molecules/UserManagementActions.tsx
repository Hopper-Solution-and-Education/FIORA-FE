// filepath: src/features/profile/presentation/modules/profile/molecules/UserManagementActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { UserRole } from '@prisma/client';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { useState } from 'react';
import InfoActionRow from '../atoms/InforActionRow';
import { UserBlockAction } from './UserBlockAction';
import { UserRoleSelector } from './UserRoleSelector';

interface UserManagementActionsProps {
  userId: string;
  userEmail: string;
  userName?: string;
  currentRole?: UserRole;
  currentUserRole?: UserRole;
  onRoleUpdate?: (userId: string, newRole: UserRole) => Promise<void>;
  onBlockUser?: (userId: string, reason?: string) => Promise<void>;
  isBlocked?: boolean;
}

export function UserManagementActions({
  userId,
  userName,
  userEmail,
  currentRole,
  currentUserRole = UserRole.User,
  onRoleUpdate,
  onBlockUser,
  isBlocked,
}: UserManagementActionsProps) {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    if (onRoleUpdate) {
      await onRoleUpdate(userId, newRole);
    }
  };

  const handleBlockConfirm = async (userId: string, reason?: string) => {
    if (onBlockUser) {
      await onBlockUser(userId, reason);
    }
  };

  // const handleBlockConfirm = async (userId: string, reason?: string) => {
  //   if (isBlocked && onUnblockUser) {
  //     await onUnblockUser(userId, reason);
  //   } else if (!isBlocked && onBlockUser) {
  //     await onBlockUser(userId, reason);
  //   }
  // };

  const ICON_COLOR_BLUE = 'text-blue-500';
  const ICON_COLOR_RED = 'text-red-500';
  const ROLE_COLORS = {
    Admin: 'bg-orange-100 text-orange-800',
    CS: 'bg-green-100 text-green-800',
    User: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="mt-6">
      <InfoActionRow
        label="Roles"
        iconColor={ICON_COLOR_BLUE}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        actions={
          <>
            <button
              type="button"
              className={`inline-flex items-center gap-2 ${ROLE_COLORS[currentUserRole || 'User']} text-sm font-medium px-4 py-2 rounded-lg shadow`}
            >
              <span className="hidden sm:inline font-semibold">{currentRole || 'User'}</span>
            </button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRoleDialogOpen(true)}
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg bg-white"
            >
              <CirclePlus />
              <span>Assign</span>
            </Button>
          </>
        }
      />

      <InfoActionRow
        label="Block This User"
        iconColor={ICON_COLOR_RED}
        description="They will be immediately added to the blacklist"
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsBlockDialogOpen(true)}
            className="inline-flex items-center gap-2 border border-red-100 text-red-600 text-sm px-4 py-2 rounded-lg bg-white shadow-sm"
          >
            <CircleMinus />
            <span>{isBlocked ? 'Unblock' : 'Block'}</span>
          </Button>
        }
      />

      <UserRoleSelector
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        userId={userId}
        currentRole={currentRole}
        userEmail={userEmail}
        userName={userName}
        onRoleUpdate={handleRoleUpdate}
        currentUserRole={currentUserRole}
      />

      <UserBlockAction
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        action={isBlocked ? 'unblock' : 'block'}
        userId={userId}
        userName={userName}
        onConfirm={handleBlockConfirm}
      />
    </div>
  );
}
