'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ICON_SIZE } from '@/shared/constants/size';
import { Bell, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../../Breadcrumbs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';
import { SidebarTrigger } from '../../ui/sidebar';
import { UserNav } from '../user-nav/UserNav';
import FinanceSummary from './FinanceSummary';
import HelpCenter from './HelpCenter';
import SettingCenter from './SettingCenter';

const keyOpenAnnouncement = 'isOpenAnnouncement';

export default function Header() {
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(() => {
    // Get the stored state from localStorage, default to true if not found
    const storedState = localStorage.getItem(keyOpenAnnouncement);
    return storedState === null ? true : JSON.parse(storedState);
  });

  useEffect(() => {
    localStorage.setItem(keyOpenAnnouncement, isOpenAnnouncement);
  }, [isOpenAnnouncement]);

  return (
    <header className="transition-[width,height] ease-linear">
      {/* Announcement */}
      {isOpenAnnouncement && (
        <div className="relative w-full">
          <Alert variant="default" className="rounded-none hidden md:block relative">
            <AlertDescription>This is an important announcement for all users.</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpenAnnouncement(false)}
            >
              ✕
            </Button>
          </Alert>
        </div>
      )}

      {/* FBalance, FDebt & Search */}
      <section className="flex h-14 shrink-0 items-center justify-between gap-4 px-4">
        {/* Tài chính */}
        <FinanceSummary />

        {/* Icon Buttons + User */}
        <div className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Bell
                size={ICON_SIZE.MD}
                className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Gift
                size={ICON_SIZE.MD}
                className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Check your rewards</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <HelpCenter />
          <SettingCenter />

          <UserNav />
        </div>
      </section>

      {/* Breadcrumbs dưới */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
