'use client';

import { Button } from '@/components/ui/button';

import { SidebarTrigger } from '@/components/ui/sidebar';
import useAnnouncementManager from '@/shared/hooks/useAnnouncementManager';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { Breadcrumbs } from '../../Breadcrumbs';
import { Separator } from '../../ui/separator';
import { UserNav } from '../user-nav/UserNav';
import FinanceSummary from './components/FinanceSummary';
import HelpCenter from './components/HelpCenter';
import MarqueeAnnouncement from './components/MarqueAnnouncement';
import NewsCenter from './components/NewsCenter';
import { NotificationContent } from './components/NotificationContent';
import Rewards from './components/Rewards';
import SettingCenter from './components/SettingCenter';

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
    <header className="sticky top-0 z-40 transition-[width,height] ease-linear backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm mb-4">
      {/* Announcement */}
      {showAnnouncement && announcement?.data?.[0]?.content && !isLoading && (
        <div className="flex items-center justify-between w-full bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-b border-red-200 dark:border-red-800/50 px-4 py-2">
          <MarqueeAnnouncement className="text-sm w-full text-red-700 dark:text-red-400 font-medium">
            {announcement?.data?.[0]?.content}
          </MarqueeAnnouncement>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 transition-colors"
          >
            ✕
          </Button>
        </div>
      )}

      {/* FBalance, FDebt & Search */}
      <section className="flex h-16 shrink-0 items-center justify-between gap-6 px-6 py-3">
        {/* Tài chính */}
        <FinanceSummary />

        {/* Icon Buttons + User */}
        <div className="hidden md:flex items-center gap-4 pt-4">
          <NotificationContent
            data={notification?.data || []}
            onNotificationUpdate={handleNotificationUpdate}
          />

          <Rewards />

          <NewsCenter />

          <HelpCenter />

          <SettingCenter />

          <UserNav />
        </div>
      </section>

      {/* Breadcrumbs dưới */}
      <div className="flex items-center justify-between gap-2 p-4 pt-8">
        <div className="flex items-center gap-4 w-full">
          {isMobile && <SidebarTrigger className="hover:bg-accent transition-colors" />}
          <Separator orientation="vertical" className="mr-2 h-5 bg-border/60" />
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
