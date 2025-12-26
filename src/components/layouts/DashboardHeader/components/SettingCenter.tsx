'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import growthbook from '@/config/growthbook/growthbook';
import { NavItem } from '@/features/landing/presentation/atoms/NavItem';
import { ICON_SIZE } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleCurrency } from '@/store/slices/setting.slice';
import { Currency } from '@prisma/client';
import usdIcon from '@public/icons/usd.svg';
import { Settings } from 'lucide-react';
import { Session, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { filterMenuItems, MenuSettingItem, menuSettingItems } from '../utils';

export default function SettingCenter() {
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
      <DropdownMenuTrigger asChild>
        <div>
          <NavItem
            label="Settings"
            data-test="setting-center"
            icon={
              <Settings
                size={ICON_SIZE.MD}
                className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110"
              />
            }
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        data-test="setting-dropdown-content"
        className={`${
          session?.user ? 'w-[350px] grid-cols-5' : 'w-[180px] grid-cols-3'
        } p-4 grid gap-4 border-border/50 shadow-lg bg-background/95 backdrop-blur-sm`}
      >
        <NavItem
          label={'Currency'}
          className="text-center"
          onClick={handleOpenCurrencyDropdown}
          tooltip="Currency Display"
          icon={
            <div data-test="currency-toggle-button">
              <Image src={usdIcon} alt="USD" width={21} height={21} className="dark:invert" />
            </div>
          }
        />

        {session?.user &&
          filteredMenuItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              passHref
              data-test={`menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <NavItem
                label={item.shortLabel || item.label}
                className="text-center"
                tooltip={item.label}
                icon={
                  <item.icon
                    size={ICON_SIZE.MD}
                    className="text-foreground hover:text-primary transition-colors"
                  />
                }
              />
            </Link>
          ))}

        {showCurrencyDropdown && (
          <div
            data-test="currency-dropdown"
            className="col-span-5 py-2 border-t-[1px] border-border/60 grid grid-cols-5 gap-2"
          >
            {getSupportedCurrencies().map((currency: string) => (
              <NavItem
                key={currency}
                label={currency}
                data-test={`currency-option-${currency.toLowerCase()}`}
                onClick={(e) => handleToggleCurrency(e, currency)}
                icon={
                  <div className={'w-6 h-6 text-center text-md font-semibold text-foreground'}>
                    {exchangeRates[currency].suffix}
                  </div>
                }
                iconActive={selectedCurrency === currency}
              />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
