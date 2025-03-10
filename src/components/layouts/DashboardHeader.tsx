'use client';

import { Breadcrumbs } from '../Breadcrumbs';
import SearchInput from '../SearchInput';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import ThemeToggle from './theme-toggle/ThemeToggle';
import { UserNav } from './UserNav';
import { Bell, Gift, HelpCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  // Giả lập dữ liệu tài chính
  const FBalance = 10000.0;
  const FDebt = 2000.0;

  return (
    <header className="transition-[width,height] ease-linear">
      {/* Announcement */}
      <Alert variant="default" className="rounded-none">
        <AlertTitle>Announcement</AlertTitle>
        <AlertDescription>This is an important announcement for all users.</AlertDescription>
      </Alert>

      {/* FBalance, FDebt & Search */}
      <section className="flex h-14 shrink-0 items-center justify-between gap-4 px-4">
        {/* Tài chính */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-600">FBalance:</span>
            <div className="w-32  text-right px-3 py-1 rounded">
              {FBalance.toLocaleString()} USD
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-600">FDebt:</span>
            <div className="w-32 text-right px-3 py-1 rounded">{FDebt.toLocaleString()} USD</div>
          </div>
        </div>
        {/* Icon Buttons + User */}
        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Gift className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Check your rewards</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Help Center</DropdownMenuItem>
              <DropdownMenuItem>Contact Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Security Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          <UserNav />
        </div>
      </section>

      {/* Breadcrumbs dưới */}
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </div>
        {/* Search Input */}
        <div>
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
