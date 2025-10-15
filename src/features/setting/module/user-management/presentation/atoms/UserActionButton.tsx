'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@prisma/client';
import { icons, MoreHorizontal } from 'lucide-react';

interface UserActionButtonProps {
  userId: string;
  userRole: UserRole;
  userStatus: string;
  onViewProfile?: (userId: string) => void;
  onEditRole?: (userId: string) => void;
  onBlockUser?: (userId: string) => void;
  onUnblockUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  currentUserRole?: UserRole;
}

export function UserActionButton({
  userId,
  userStatus,
  onViewProfile,
  onEditRole,
  onBlockUser,
  onUnblockUser,
  onDeleteUser,
  currentUserRole = UserRole.User,
}: UserActionButtonProps) {
  const canManageUsers = currentUserRole === UserRole.Admin || currentUserRole === UserRole.CS;
  const canAssignRoles = currentUserRole === UserRole.Admin;
  const isBlocked = userStatus === 'Blocked';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewProfile?.(userId)}>
          <icons.User className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        {canAssignRoles && (
          <DropdownMenuItem onClick={() => onEditRole?.(userId)}>
            <icons.Settings className="mr-2 h-4 w-4" />
            Assign Role
          </DropdownMenuItem>
        )}

        {canManageUsers && (
          <>
            <DropdownMenuSeparator />
            {isBlocked ? (
              <DropdownMenuItem onClick={() => onUnblockUser?.(userId)}>
                <icons.Check className="mr-2 h-4 w-4" />
                Unblock User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onBlockUser?.(userId)}>
                <icons.Ban className="mr-2 h-4 w-4" />
                Block User
              </DropdownMenuItem>
            )}
          </>
        )}

        {currentUserRole === UserRole.Admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDeleteUser?.(userId)}
              className="text-red-600 hover:text-red-700"
            >
              <icons.Trash className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
