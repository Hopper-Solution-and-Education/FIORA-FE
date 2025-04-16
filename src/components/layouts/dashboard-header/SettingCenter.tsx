'use client';

import { Icons } from '@/components/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeLanguage, toggleCurrency } from '@/store/slices/setting.slice';
import EnglishIcon from '@public/icons/united-kingdom.png';
import usdIcon from '@public/icons/usd.svg';
import VietnameseIcon from '@public/icons/vietnam.png';
import vndIcon from '@public/icons/vnd.svg';
import { Settings } from 'lucide-react';
import { Session, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { menuSettingItems } from './utils';

export default function SettingCenter() {
  const { theme, setTheme } = useTheme();
  const { currency, language } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [currency, language]);

  const toggleTheme = (e: any) => {
    e.stopPropagation();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleToggleLanguage = (e: any) => {
    e.stopPropagation();
    dispatch(changeLanguage(language === 'en' ? 'vi' : 'en'));
  };

  const handleToggleCurrency = (e: any) => {
    e.stopPropagation();
    dispatch(toggleCurrency(currency === 'USD' ? 'VND' : 'USD'));
  };

  const filteredMenuItems = menuSettingItems.filter(
    (item) => !item.role || session?.user?.role === item.role,
  );

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
            session?.user ? 'w-[300px] grid-cols-5' : 'w-[120px] grid-cols-2'
          } p-4 grid gap-4 border shadow-md`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={toggleTheme}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Icons.sun size={ICON_SIZE.MD} />
                ) : (
                  <Icons.moon size={ICON_SIZE.MD} />
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
                onClick={handleToggleLanguage}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {language === 'en' ? (
                  <Image src={VietnameseIcon} alt="VND" width={20} height={20} />
                ) : (
                  <Image src={EnglishIcon} alt="USD" width={20} height={20} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Toggle Language</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={handleToggleCurrency}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {currency === 'VND' ? (
                  <Image src={vndIcon} alt="VND" width={20} height={20} className="dark:invert" />
                ) : (
                  <Image src={usdIcon} alt="USD" width={20} height={20} className="dark:invert" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>Toggle Currency</span>
            </TooltipContent>
          </Tooltip>

          {session?.user &&
            filteredMenuItems.map((item, index) => (
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
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
