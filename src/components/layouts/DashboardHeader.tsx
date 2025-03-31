'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/shared/utils';
import { Bell, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { UserNav } from './UserNav';
import HelpCenter from './theme-toggle/HelpCenter';
import SettingCenter from './theme-toggle/SettingCenter';
import { ICON_SIZE } from '@/shared/constants/size';

export default function Header() {
  // state
  const [FBalance, setFBalance] = useState('0.0');
  const [FDebt, setFDebt] = useState('0.0');
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenAnountment, setIsOpenAnountment] = useState(true);

  const fetchUserBalance = async () => {
    try {
      const response = await fetch('/api/accounts/balance');
      const data = await response.json();
      if (data.status !== 200) {
        alert('Error fetching user balance:' + data.message);
        return;
      } else {
        const { balance, dept } = data.data;
        const formatBalance = formatCurrency(balance);
        const formatDept = formatCurrency(dept);
        setFBalance(formatBalance);
        setFDebt(formatDept);
        setIsLoading(false);
      }
    } catch (error: any) {
      alert('Error fetching user balance:' + error.message);
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, []);

  return (
    <header className="transition-[width,height] ease-linear">
      {/* Announcement */}
      {isOpenAnountment && (
        <div className="relative w-full">
          <Alert variant="default" className="rounded-none hidden md:block relative">
            <AlertDescription>This is an important announcement for all users.</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpenAnountment(false)}
            >
              ✕
            </Button>
          </Alert>
        </div>
      )}

      {/* FBalance, FDebt & Search */}
      <section className="flex h-14 shrink-0 items-center justify-between gap-4 px-4">
        {/* Tài chính */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-600">FBalance:</span>
            <div className="w-100 text-right px-3 py-1 rounded">
              {isLoading ? 'Loading...' : FBalance}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-600">FDebt:</span>
            <div className="w-100 text-right px-3 py-1 rounded">
              {isLoading ? 'Loading...' : FDebt}
            </div>
          </div>
        </div>
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
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
