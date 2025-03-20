'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/shared/utils';
import { Bell, Gift, HelpCircle, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import ThemeToggle from './theme-toggle/ThemeToggle';
import { UserNav } from './UserNav';

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
      </div>
    </header>
  );
}
