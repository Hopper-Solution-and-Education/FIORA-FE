'use client';

import { SegmentProgressBar } from '@/components/common/atoms';
import { Icons } from '@/components/Icon';
import { resetAcknowledgment } from '@/features/acknowledgment/slides';
import { useGetProfileQuery } from '@/features/profile/store/api/profileApi';
import UserAvatar from '@/features/setting/module/user-management/presentation/atoms/UserAvatar';
import { useGetUsersQuery } from '@/features/setting/module/user-management/store/api/userApi';
import {
  COLORS,
  globalNavItems,
  ICON_SIZE,
  notSignInNavItems,
  RouteEnum,
  UserRole,
} from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { clearSkip } from '@/shared/utils/skipTour';
import { useAppDispatch, useAppSelector } from '@/store';
import { getCurrentTierAsyncThunk } from '@/store/actions';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

function UserNav() {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const { clearExchangeRateData } = useCurrencyFormatter();
  const dispatch = useAppDispatch();
  const { data: userTier, isLoading: isLoadingUserTier } = useAppSelector(
    (state) => state.user.userTier,
  );
  const canViewSwitchProfile = profile?.role === UserRole.ADMIN || profile?.role === UserRole.CS;
  const { data: userData } = useGetUsersQuery({ pageSize: 3 }, { skip: !canViewSwitchProfile });

  const switchProfile = (userData?.data ?? []).map((user) => ({
    userId: user.User?.id,
    title: user.User?.name || user.User?.email || 'No Name',
    image: user.User?.avatarUrl,
  }));

  useEffect(() => {
    if (!isLoadingUserTier) {
      dispatch(getCurrentTierAsyncThunk());
    }
  }, []);

  const renderNavItem = (item: (typeof globalNavItems)[0]) => {
    const Icon = item.icon ? Icons[item.icon] : Icons.logo;
    return (
      <DropdownMenuItem
        key={item.title}
        onClick={() => router.push(item.url)}
        className="cursor-pointer"
      >
        <Link href={item.url}>{item.title}</Link>
        <DropdownMenuShortcut>
          <Icon {...item.props} className="h-4 w-4" />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    );
  };

  const profileRole = () => {
    return profile && profile?.role !== UserRole.USER ? (
      <p className="text-xs text-red-500">{profile?.role}</p>
    ) : null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="group flex items-center space-x-2 rounded-md px-3 py-1.5 transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-tour="homepage-user-nav"
        >
          <div className="relative h-14 w-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-medium transition-transform group-hover:scale-110">
            {profile?.avatarUrl ? (
              <Image
                src={profile?.avatarUrl}
                alt={profile?.name || 'User Avatar'}
                width={44} // w-9 = 36px
                height={44} // h-9 = 36px
                className="object-cover"
              />
            ) : (
              // Fallback: show first two letters, capitalized
              <span>{profile?.name?.slice(0, 2)?.toUpperCase() || 'CN'}</span>
            )}
          </div>
          {profile && (
            <div className="flex flex-col items-start min-w-28">
              {profileRole()}
              {/* truncate and max-w-32 to prevent overflow */}
              <p className="text-xs text-muted-foreground max-w-32 truncate">{profile?.email}</p>
              <p className="text-xs text-muted-foreground max-w-32 truncate">
                {userTier?.currentTier?.tierName}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        {profile ? (
          <>
            <DropdownMenuItem>
              <Link className="w-full space-y-2 cursor-pointer" href={RouteEnum.Membership}>
                <div className="text-sm">Membership</div>
                <SegmentProgressBar
                  leftLabel={userTier?.currentTier?.tierName || ''}
                  rightLabel={userTier?.nextBalanceTier?.tierName || ''}
                  progress={userTier?.currentBalance}
                  color={COLORS.DEPS_INFO.LEVEL_1}
                  className="w-full"
                  min={userTier?.currentTier?.balanceMinThreshold}
                  max={userTier?.nextBalanceTier?.balanceMinThreshold}
                />
                <SegmentProgressBar
                  leftLabel={userTier?.currentTier?.tierName || ''}
                  rightLabel={userTier?.nextSpendingTier?.tierName || ''}
                  progress={userTier?.currentSpent}
                  color={COLORS.DEPS_SUCCESS.LEVEL_1}
                  className="w-full"
                  min={userTier?.currentTier?.spentMinThreshold}
                  max={userTier?.nextSpendingTier?.spentMinThreshold}
                />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{globalNavItems.map(renderNavItem)}</DropdownMenuGroup>

            {/* Switch Profile Zone */}
            {canViewSwitchProfile && (
              <>
                <DropdownMenuSeparator />
                <div className="flex items-center gap-2 my-1 justify-between w-full px-2">
                  <div className="text-sm font-medium">Switch Profile</div>
                  <Link
                    href="/setting/user-management"
                    className="text-xs cursor-pointer text-blue-400 underline hover:text-blue-500"
                  >
                    Other
                  </Link>
                </div>
                <DropdownMenuGroup>
                  {switchProfile.map((item) => (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      key={item.title}
                      onClick={() =>
                        router.push(`/ekyc/${encodeURIComponent(item.userId)}/profile`)
                      }
                    >
                      <div className="flex items-center justify-center gap-2 w-full">
                        <UserAvatar src={item.image} name={item.title} size="sm" />
                        <div className="text-blue-400 underline hover:text-blue-500 w-full truncate whitespace-nowrap">
                          {item.title}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {/* Sign Out Zone */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                clearExchangeRateData();
                clearSkip(); // Clear skip tour data
                dispatch(resetAcknowledgment());
                signOut();
              }}
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

export default UserNav;
