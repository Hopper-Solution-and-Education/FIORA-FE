'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import useAnnouncementManager from '@/shared/hooks/useAnnouncementManager';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { Gift } from 'lucide-react';
import { Breadcrumbs } from '../../Breadcrumbs';
import { Separator } from '../../ui/separator';
import { UserNav } from '../user-nav/UserNav';
import FinanceSummary from './FinanceSummary';
import HelpCenter from './HelpCenter';
import MarqueeAnnouncement from './MarqueAnnouncement';
import NewsCenter from './NewsCenter';
import { NotificationContent } from './NotificationContent';
import SettingCenter from './SettingCenter';

export default function Header() {
  const isMobile = useIsMobile();
  const { announcement, isLoading, show: showAnnouncement, handleClose } = useAnnouncementManager();

  const { data: notification, mutate: mutateNotification } = useDataFetch({
    endpoint: '/api/notification/user?unread=true&channel=BOX',
    method: 'GET',
  });

  const handleNotificationUpdate = () => {
    // Refresh the notification data
    mutateNotification();
  };

  return (
    <header className="transition-[width,height] ease-linear">
      {/* Announcement */}
      {showAnnouncement && announcement?.data?.[0]?.content && !isLoading && (
        <div className="flex items-center justify-between w-full">
          <MarqueeAnnouncement className="text-sm w-full text-red-700">
            {announcement?.data?.[0]?.content}
          </MarqueeAnnouncement>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            ✕
          </Button>
        </div>
      )}

      {/* FBalance, FDebt & Search */}
      <section className="flex h-14 shrink-0 items-center justify-between gap-4 px-4">
        {/* Tài chính */}
        <FinanceSummary />

        {/* Icon Buttons + User */}
        <div className="hidden md:flex items-center gap-6">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Bell
                size={ICON_SIZE.MD}
                className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          <NotificationContent
            data={notification?.data || []}
            onNotificationUpdate={handleNotificationUpdate}
          />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <Gift
                      size={ICON_SIZE.MD}
                      className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                    />
                    <span className="text-sm">Rewards</span>
                  </div>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rewards</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Check your rewards</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NewsCenter />
          <HelpCenter />
          <SettingCenter />

          <UserNav />
        </div>
      </section>

      {/* Breadcrumbs dưới */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-4">
          {isMobile && <SidebarTrigger />}
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
