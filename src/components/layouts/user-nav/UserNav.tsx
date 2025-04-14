'use client';

import { Icons } from '@/components/Icon';
import { globalNavItems, notSignInNavItems } from '@/shared/constants/data';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface UserNavProps {
  handleSignOut?: () => void;
}

export function UserNav({ handleSignOut }: UserNavProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const renderNavItem = (item: (typeof globalNavItems)[0]) => {
    const Icon = item.icon ? Icons[item.icon] : Icons.logo;
    return (
      <DropdownMenuItem
        key={item.title}
        onClick={() => router.push(item.url)}
        className="cursor-pointer"
      >
        <span>{item.title}</span>
        <DropdownMenuShortcut>
          <Icon {...item.props} className="h-4 w-4" />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex items-center space-x-2 rounded-md transition-all duration-200">
          <Avatar className="h-9 w-9 transition-transform group-hover:scale-110">
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
            <AvatarFallback className="rounded-lg">
              {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
            </AvatarFallback>
          </Avatar>
          {session && (
            <div className="flex flex-col items-start space-y-0.5">
              <p className="text-sm max-w-32 leading-none truncate group-hover:text-primary">
                {session.user?.name}
              </p>
              <p className="text-xs text-muted-foreground max-w-32 truncate">
                {session.user?.email}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {session ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{globalNavItems.map(renderNavItem)}</DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (handleSignOut ? handleSignOut() : signOut())}
              className="cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuGroup>{notSignInNavItems.map(renderNavItem)}</DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
