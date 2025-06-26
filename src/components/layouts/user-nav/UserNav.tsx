'use client';

import { SegmentProgressBar } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { COLORS } from '@/shared/constants/chart';
import { globalNavItems, notSignInNavItems } from '@/shared/constants/data';
import { ICON_SIZE } from '@/shared/constants/size';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

const switchProfile = [
  {
    title: 'User 1',
    image: 'https://picsum.photos/200',
  },
  {
    title: 'User 2',
    image: 'https://picsum.photos/200',
  },
  {
    title: 'User 3',
    image: 'https://picsum.photos/200',
  },
];

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

  const handleClickMembership = () => {
    router.push('/membership');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex items-center space-x-2 rounded-md px-3 py-1.5 transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="relative h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-medium transition-transform group-hover:scale-110">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session?.user?.name || 'User Avatar'}
                width={36} // w-9 = 36px
                height={36} // h-9 = 36px
                className="object-cover"
              />
            ) : (
              // Fallback: show first two letters, capitalized
              <span>{session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}</span>
            )}
          </div>
          {session && (
            <div className="flex flex-col items-start space-y-0.5">
              {/* truncate and max-w-32 to prevent overflow */}
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
            <DropdownMenuItem>
              <div className="w-full space-y-2 cursor-pointer" onClick={handleClickMembership}>
                <div className="text-sm">Membership</div>
                <SegmentProgressBar
                  leftLabel="Platinum"
                  rightLabel="Diamond"
                  progress={0.35}
                  color={COLORS.DEPS_INFO.LEVEL_1}
                  className="w-full"
                />
                <SegmentProgressBar
                  leftLabel="Qili"
                  rightLabel="Dragon"
                  progress={0.65}
                  color={COLORS.DEPS_SUCCESS.LEVEL_1}
                  className="w-full"
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{globalNavItems.map(renderNavItem)}</DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 my-1 justify-between w-full px-2">
              <div className="text-sm font-medium">Switch Profile</div>
              <div className="text-xs cursor-pointer text-blue-400 underline hover:text-blue-500">
                Other
              </div>
            </div>
            <DropdownMenuGroup>
              {switchProfile.map((item) => (
                <DropdownMenuItem className="cursor-pointer " key={item.title}>
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Image
                      width={24}
                      height={24}
                      src={item.image}
                      className="object-cover rounded-full"
                      alt="avatar"
                    />
                    <div className="text-blue-400 underline hover:text-blue-500 w-full truncate whitespace-nowrap">
                      {item.title}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => (handleSignOut ? handleSignOut() : signOut())}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2 justify-between w-full">
                <div>Log out</div>
                <LogOut size={ICON_SIZE.SM} />
              </div>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuGroup>{notSignInNavItems.map(renderNavItem)}</DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
