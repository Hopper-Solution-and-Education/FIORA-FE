'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { GearIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoonIcon, SunIcon } from 'lucide-react';

import EnglishIcon from '@public/icons/united-kingdom.png';
import VietnameseIcon from '@public/icons/vietnam.png';

export default function SettingCenter() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('en');

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative w-10 h-10">
          <GearIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-[120px] px-3 py-2">
        <DropdownMenuLabel className="text-center">Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleTheme();
          }}
          className="flex justify-center items-center w-full py-2"
        >
          {theme === 'dark' ? <MoonIcon size={24} /> : <SunIcon size={24} />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleLanguage();
          }}
          className="flex justify-center items-center w-full py-2"
        >
          {language === 'en' ? (
            <Image src={VietnameseIcon} alt="Vietnamese" width={20} height={20} />
          ) : (
            <Image src={EnglishIcon} alt="English" width={20} height={20} />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
