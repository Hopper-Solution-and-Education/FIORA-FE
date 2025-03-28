'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Database,
  LayoutDashboard,
  MoonIcon,
  Package,
  Settings,
  SunIcon,
  Tag,
  User,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import EnglishIcon from '@public/icons/united-kingdom.png';
import VietnameseIcon from '@public/icons/vietnam.png';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const menuSettingItems = [
  { label: 'Accounts', icon: User, url: '/home/account' },
  { label: 'Categories', icon: Tag, url: '/home/category' },
  { label: 'Products & Services', icon: Package, url: '/setting/product' },
  { label: 'Partners', icon: Database, url: '/setting/partner' },
  { label: 'Users', icon: Users, url: '/users' },
  { label: 'Landing Page', icon: LayoutDashboard, url: '/setting/landing' },
];

export default function SettingCenter() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const { data } = useSession();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Settings
            size={18}
            className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`${
            data?.user ? 'w-[300px] grid-cols-4' : 'w-[100px] grid-cols-2'
          } p-4 grid gap-4 border shadow-md`}
        >
          {data?.user &&
            menuSettingItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link href={item.url} passHref>
                    <DropdownMenuItem className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                      <item.icon className="h-6 w-6" />
                    </DropdownMenuItem>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>{item.label}</span>
                </TooltipContent>
              </Tooltip>
            ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleTheme();
                }}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <MoonIcon size={24} /> : <SunIcon size={24} />}
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Toggle Theme</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleLanguage();
                }}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {language === 'en' ? (
                  <Image src={VietnameseIcon} alt="Vietnamese" width={20} height={20} />
                ) : (
                  <Image src={EnglishIcon} alt="English" width={20} height={20} />
                )}
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Change Language</span>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
