'use client';
import growthbook from '@/config/growthbook/growthbook';
import { NavItem } from '@/features/home/types/Nav.types';
import { ICON_SIZE } from '@/shared/constants/size';
import { cn } from '@/shared/utils';
import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { Session, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icons } from '../../Icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '../../ui/sidebar';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { SectionTypeEnum } from '@/features/landing/constants';
import { useGetSection } from '@/features/landing/hooks/useGetSection';
import { useGetProfileQuery } from '@/features/profile/store/api/profileApi';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import useMatchBreakpoint from '@/shared/hooks/useMatchBreakpoint';
import HopperLogo from '@public/images/logo.jpg';
import { helpItems, menuSettingItems } from '../DashboardHeader/utils';
import { filterNavItems as filterNavItemsUtil, isItemActive as isItemActiveUtil } from './utils';

type AppSideBarProps = {
  appLabel: string;
  navItems: NavItem[];
};

export default function AppSidebar({ navItems, appLabel }: AppSideBarProps) {
  const gb = growthbook;
  const [newNavItem, setNewNavItem] = useState<NavItem[]>([]);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession() as { data: Session | null };
  const { isTablet } = useMatchBreakpoint();
  const { open, setOpen } = useSidebar();
  const { section } = useGetSection(SectionTypeEnum.HEADER, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery();
  const { clearExchangeRateData } = useCurrencyFormatter();
  const { logout } = useLogout();

  const handleLogout = async () => {
    // Clear exchange rate data BEFORE logout to ensure data is cleared while session is still active
    clearExchangeRateData();
    logout();
    redirect('/');
  };

  const isItemActive = (item: NavItem): boolean => isItemActiveUtil(item, pathname as string);

  useEffect(() => {
    const newOpenItems = navItems.reduce(
      (acc, item) => {
        acc[item.title] = isItemActive(item);
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setOpenItems(newOpenItems);
  }, [pathname, navItems]);

  useEffect(() => {
    const handleCheckNavItem = () => {
      if (navItems && session?.user?.role) {
        setNewNavItem(filterNavItemsUtil(navItems, gb, session.user.role));
      }
    };

    handleCheckNavItem();
  }, [navItems, session?.user?.role, gb]);

  const handleOpenChange = (title: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: isOpen,
    }));
  };

  const handlePressLogo = () => {
    router.push('/');
  };

  const handleClickUserNavBottom = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    !isLoadingProfile && (
      <div id="app-sidebar" className="app-bar h-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="flex flex-col">
            <div
              onClick={handlePressLogo}
              className="flex gap-3 text-sidebar-accent-foreground items-center cursor-pointer justify-center rounded-lg"
            >
              {isMobile ? (
                <div className={`relative transition-all duration-300 overflow-hidden h-35 w-full`}>
                  <Image
                    src={section?.medias[0]?.media_url || profile?.logoUrl || HopperLogo}
                    alt="FIORA"
                    width={250}
                    height={250}
                    className={`object-cover w-full h-full rounded-lg`}
                    priority
                  />
                </div>
              ) : (
                <div
                  className={`relative transition-all duration-300 overflow-hidden
                    ${open ? 'w-full h-35 ' : 'w-full h-14 md:h-18'}`}
                >
                  <Image
                    src={profile?.logoUrl || section?.medias[0]?.media_url || HopperLogo}
                    alt="FIORA"
                    width={250}
                    height={250}
                    className={`object-contain w-full h-full rounded-lg`}
                    priority
                  />
                </div>
              )}
            </div>

            {!isMobile && (
              <div
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-end cursor-pointer"
              >
                <div
                  className={cn(
                    'flex items-center justify-center rounded-lg transition-colors duration-200',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    open ? 'size-8' : 'size-8 p-2',
                  )}
                >
                  {open ? (
                    <PanelRightOpen size={ICON_SIZE.SM} />
                  ) : (
                    <PanelRightClose size={ICON_SIZE.SM} />
                  )}
                </div>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent className="overflow-x-hidden">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarGroupLabel>{appLabel}</SidebarGroupLabel>

                {newNavItem.map((item) => {
                  const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                  const isActive = isItemActive(item);

                  return item?.items && item?.items?.length > 0 ? (
                    <Collapsible
                      key={item.title}
                      asChild
                      open={openItems[item.title]}
                      onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <Link href={item.url}>
                            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                              {item.icon && <Icon size={ICON_SIZE.MD} />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </Link>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const Icon = subItem.icon ? Icons[subItem.icon] : Icons.logo;

                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={isItemActive(subItem)}>
                                    <Link
                                      href={subItem.url}
                                      className={cn(
                                        'flex items-center rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                                        isItemActive(subItem) && 'bg-accent text-accent-foreground',
                                      )}
                                    >
                                      {item.icon && <Icon size={ICON_SIZE.MD} />}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                        <Link
                          href={item.url}
                          className={cn(
                            'flex items-center rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                            isActive && 'bg-accent text-accent-foreground',
                          )}
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          {isTablet ||
            (isMobile && (
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                          <div className="relative h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-medium">
                            {session?.user?.image ? (
                              <Image
                                src={session.user.image}
                                alt={session?.user?.name || 'User Avatar'}
                                width={32} // h-8 w-8 = 32px
                                height={32} // h-8 w-8 = 32px
                                className="object-cover" // Ensure the image covers the container
                              />
                            ) : (
                              // Fallback: show first two letters, capitalized
                              <span>{session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}</span>
                            )}
                          </div>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {session?.user?.name || ''}
                            </span>
                            <span className="truncate text-xs">{session?.user?.email || ''}</span>
                          </div>
                          <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                      >
                        <DropdownMenuLabel className="p-0 font-normal">
                          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <div className="relative h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-medium">
                              {session?.user?.image ? (
                                <Image
                                  src={session.user.image}
                                  alt={session?.user?.name || 'User Avatar'}
                                  width={32} // h-8 w-8 = 32px
                                  height={32} // h-8 w-8 = 32px
                                  className="object-cover" // Ensure the image covers the container
                                />
                              ) : (
                                // Fallback: show first two letters, capitalized
                                <span>
                                  {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
                                </span>
                              )}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-semibold">
                                {session?.user?.name || ''}
                              </span>
                              <span className="truncate text-xs">
                                {' '}
                                {session?.user?.email || ''}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Help Center</DropdownMenuLabel>
                        {helpItems.map((item) => (
                          <DropdownMenuItem key={item.label} asChild>
                            <div
                              className="flex items-center gap-2"
                              onClick={() => handleClickUserNavBottom(item.url)}
                            >
                              <item.icon />
                              {item.label}
                            </div>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        {menuSettingItems.map((item) => (
                          <DropdownMenuItem key={item.label} asChild>
                            <div
                              className="flex items-center gap-2"
                              onClick={() => handleClickUserNavBottom(item.url)}
                            >
                              <item.icon />
                              {item.label}
                            </div>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="flex items-center gap-2"
                        >
                          <LogOut />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            ))}
          <SidebarRail className="!after:hidden" />
        </Sidebar>
      </div>
    )
  );
}
