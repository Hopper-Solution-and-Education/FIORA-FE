'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useState } from 'react';

import EnglishIcon from '@public/icons/united-kingdom.png';
import VietnameseIcon from '@public/icons/vietnam.png';

export default function LanguageToggle() {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Thêm logic lưu vào localStorage hoặc Context API nếu cần
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative w-10 h-10">
          <Image
            src={language === 'en' ? EnglishIcon : VietnameseIcon}
            alt="Language Icon"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          <Image src={EnglishIcon} alt="English" width={20} height={20} className="mr-2" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('vi')}>
          <Image src={VietnameseIcon} alt="Vietnamese" width={20} height={20} className="mr-2" />
          Tiếng Việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
