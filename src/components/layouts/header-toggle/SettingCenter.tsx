'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import EnglishIcon from '@public/icons/united-kingdom.png';
import VietnameseIcon from '@public/icons/vietnam.png';
import {
  Database,
  LayoutTemplate,
  MoonIcon,
  Package,
  Settings,
  SunIcon,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const menuSettingItems = [
  // { label: 'Accounts', icon: User, url: '/home/account' },
  // { label: 'Categories', icon: Tag, url: '/home/category' },
  { label: 'Products & Services', icon: Package, url: '/setting/product' },
  { label: 'Partners', icon: Database, url: '/setting/partner' },
  { label: 'Users', icon: Users, url: '/users' },
  { label: 'Landing Page', icon: LayoutTemplate, url: '/setting/landing' },
];

export default function SettingCenter() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const { data } = useSession();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleTheme = (e: any) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = (e: any) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <TooltipProvider>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Settings
            size={ICON_SIZE.MD}
            className="transition-all duration-200 hover:scale-110 cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`${
            data?.user ? 'w-[300px] grid-cols-4' : 'w-[100px] grid-cols-2'
          } p-4 grid gap-4 border shadow-md`}
          onClick={(e) => e.stopPropagation()} // Ngăn scroll khi click vào menu
        >
          {data?.user &&
            menuSettingItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link href={item.url} passHref>
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                      <item.icon size={ICON_SIZE.MD} />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>{item.label}</span>
                </TooltipContent>
              </Tooltip>
            ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={toggleTheme} // Sử dụng hàm với stopPropagation
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <MoonIcon size={ICON_SIZE.MD} />
                ) : (
                  <SunIcon size={ICON_SIZE.MD} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Toggle Theme</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={toggleLanguage} // Sử dụng hàm với stopPropagation
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {language === 'en' ? (
                  <Image src={VietnameseIcon} alt="Vietnamese" width={20} height={20} />
                ) : (
                  <Image src={EnglishIcon} alt="English" width={20} height={20} />
                )}
              </div>
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
