'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import growthbook from '@/config/growthbook/growthbook';
import { ICON_SIZE } from '@/shared/constants/size';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleCurrency } from '@/store/slices/setting.slice';
import { Currency } from '@prisma/client';
import usdIcon from '@public/icons/usd.svg';
import { Settings } from 'lucide-react';
import { Session, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { filterMenuItems, MenuSettingItem, menuSettingItems } from './utils';

type SettingCenterProps = {
  isShowingText?: boolean;
};

export default function SettingCenter({ isShowingText = true }: SettingCenterProps) {
  const { theme, setTheme } = useTheme();
  const { currency, language } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const gb = growthbook;
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuSettingItem[]>([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const { getSupportedCurrencies, selectedCurrency, exchangeRates } = useCurrencyFormatter();

  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [currency, language]);

  const toggleTheme = (e: any) => {
    e.stopPropagation();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenCurrencyDropdown = (e: any) => {
    e.stopPropagation();
    setShowCurrencyDropdown(!showCurrencyDropdown);
  };

  const handleToggleCurrency = (e: any, currency: string) => {
    e.stopPropagation();
    dispatch(toggleCurrency(currency as Currency));
  };

  useEffect(() => {
    const handleCheckMenuItems = () => {
      if (menuSettingItems && session?.user?.role) {
        setFilteredMenuItems(filterMenuItems(menuSettingItems, gb, session.user.role));
      }
    };

    handleCheckMenuItems();
  }, [menuSettingItems, session?.user?.role, gb]);

  return (
    <DropdownMenu modal={false}>
      <CommonTooltip content={<p>Settings</p>} side="top" delayDuration={0}>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col gap-1 justify-center items-center">
            <Settings
              size={ICON_SIZE.MD}
              className="transition-all duration-200 hover:scale-110 cursor-pointer"
            />
            {isShowingText && <span className="text-sm">Settings</span>}
          </div>
        </DropdownMenuTrigger>
      </CommonTooltip>

      <DropdownMenuContent
        align="end"
        className={`${
          session?.user ? 'w-[300px] grid-cols-5' : 'w-[180px] grid-cols-3'
        } p-4 grid gap-4 border shadow-md`}
      >
        <CommonTooltip content={<span>Toggle Theme</span>} side="top" delayDuration={0}>
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
        </CommonTooltip>

        <CommonTooltip content={<span>Currency Display</span>} side="top" delayDuration={0}>
          <div
            onClick={handleOpenCurrencyDropdown}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Image src={usdIcon} alt="USD" width={20} height={20} className="dark:invert" />
          </div>
        </CommonTooltip>

        {session?.user &&
          filteredMenuItems.map((item, index) => (
            <CommonTooltip
              content={<span>{item.label}</span>}
              side="top"
              delayDuration={0}
              key={index}
            >
              <Link href={item.url} passHref>
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                  <item.icon size={ICON_SIZE.MD} />
                </div>
              </Link>
            </CommonTooltip>
          ))}

        {showCurrencyDropdown && (
          <div className="col-span-5 py-2 border-t-[1px] border-gray-200 dark:border-gray-700 grid grid-cols-5 gap-2">
            {getSupportedCurrencies().map((currency: string) => (
              <CommonTooltip
                content={<span>{currency}</span>}
                side="top"
                delayDuration={0}
                key={currency}
              >
                <div
                  onClick={(e) => handleToggleCurrency(e, currency)}
                  className={`flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    selectedCurrency === currency ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                >
                  <span className="text-md font-semibold">{exchangeRates[currency].suffix}</span>
                </div>
              </CommonTooltip>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
