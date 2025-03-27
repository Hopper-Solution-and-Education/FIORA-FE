'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import growthbook from '@/config/growthbook';
import { NavItem } from '@/features/home/types/Nav.types';
import { useGetSection } from '@/features/landing/hooks/useGetSection';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SectionType } from '@prisma/client';
import HopperLogo from '@public/images/logo.jpg';
import { ChevronRight, ChevronsUpDown, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icons } from '../Icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
} from '../ui/sidebar';

export const company = {
  name: 'FIORA Inc',
  logo: HopperLogo,
  plan: 'Enterprise',
};

type AppSideBarProps = {
  appLabel: string;
  navItems: NavItem[];
};

export default function AppSidebar({ navItems, appLabel }: AppSideBarProps) {
  const gb = growthbook;
  const [newNavItem, setNewNavItem] = useState<NavItem[]>([]);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { section } = useGetSection(SectionType.HEADER);
  const isMobile = useIsMobile();
  const { open } = useSidebar();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

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
    const filterNavItems = (items: NavItem[]): NavItem[] => {
      return items.flatMap((item) => {
        if (!item.featureFlags || gb.isOn(item.featureFlags)) {
          return [
            {
              ...item,
              items: item.items ? filterNavItems(item.items) : undefined,
            },
          ];
        }
        return [];
      });
    };

    const handleCheckNavItem = () => {
      if (navItems) {
        setNewNavItem(filterNavItems(navItems));
      }
    };

    handleCheckNavItem();
  }, [navItems]);

  const isItemActive = (item: NavItem) => {
    if (item.url === pathname) return true;
    if (item.items?.some((subItem) => subItem.url === pathname)) return true;
    return false;
  };

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

  const handleOpenChange = (title: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: isOpen,
    }));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-3 py-3 text-sidebar-accent-foreground items-center">
          {/* Logo */}
          <div
            className={`flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-all duration-300 ${
              isMobile
                ? open
                  ? 'size-10 sm:size-12'
                  : 'size-6 sm:size-7'
                : open
                  ? 'size-10 sm:size-12 md:size-14 lg:size-16 xl:size-16'
                  : 'size-6 sm:size-7 md:size-8'
            }`}
          >
            <Image
              src={section?.medias[0].media_url || company.logo}
              alt="Fiora Logo"
              width={160}
              height={160}
              className="object-contain w-full h-full rounded-md"
              priority
            />
          </div>

          {/* Text Info */}
          <div className="grid flex-1 text-left">
            <span className="truncate font-semibold text-base sm:text-md md:text-lg">
              {section?.medias[0].description}
            </span>
            <span className="truncate text-sm sm:text-sm md:text-md text-gray-400">
              {company.plan}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>{appLabel}</SidebarGroupLabel>
          <SidebarMenu>
            {newNavItem.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const isActive = isItemActive(item);

              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  open={openItems[item.title]} // Controlled state
                  onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)} // Xử lý thay đổi
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
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
      {isMobile && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || ''}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{session?.user?.name || ''}</span>
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
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session?.user?.image || ''}
                          alt={session?.user?.name || ''}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session?.user?.name?.slice(0, 2)?.toUpperCase() || 'CN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.name || ''}</span>
                        <span className="truncate text-xs"> {session?.user?.email || ''}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
