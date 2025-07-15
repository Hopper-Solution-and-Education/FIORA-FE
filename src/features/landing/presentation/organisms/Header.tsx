'use client';

import HopperLogo from '@public/images/logo.jpg';
import { AnimatePresence } from 'framer-motion';
import { LogInIcon, Menu, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

import HelpCenter from '@/components/layouts/dashboard-header/HelpCenter';
import {
  default as SettingCenter,
  default as ThemeToggle,
} from '@/components/layouts/dashboard-header/SettingCenter';
import { UserNav } from '@/components/layouts/user-nav/UserNav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { ICON_SIZE } from '@/shared/constants/size';
import { SectionType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useGetSection } from '../../hooks/useGetSection';

export default function Header() {
  const { section, isLoading, isError } = useGetSection(SectionType.HEADER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isOpenAnountment, setIsOpenAnountment] = useState(true);
  const { data } = useSession();

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);

  return (
    <header
      className={`fixed bg-background/100 top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            {isLoading ? (
              <Skeleton className="max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[240px] h-auto max-h-[70px] sm:max-h-[70px] md:max-h-[70px] lg:max-h-[80px]" />
            ) : (
              <>
                {section?.medias && !isError ? (
                  <Image
                    src={section?.medias[0]?.media_url || HopperLogo}
                    alt="Fiora Logo"
                    width={240}
                    height={240}
                    className="object-contain w-auto max-w-[120px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[240px] h-auto max-h-[70px] sm:max-h-[70px] md:max-h-[70px] lg:max-h-[80px]"
                    priority
                  />
                ) : (
                  <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] xl:w-[100px] xl:h-[100px] bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm md:text-base">Logo</span>
                  </div>
                )}
              </>
            )}
          </Link>
        </div>

        <div className="w-full h-full">
          <div className="w-full">
            {isOpenAnountment && (
              <div
                className={`flex justify-between items-start ${isMobile ? 'text-xs' : 'text-base'} px-4 shadow-sm`}
              >
                <div>This is an important announcement for all users.</div>

                <X
                  size={18}
                  className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer "
                  onClick={() => setIsOpenAnountment(false)}
                />
              </div>
            )}
            <div className="flex w-full justify-end">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8 px-8 mt-3">
                <HelpCenter />
                <SettingCenter />

                {data?.user ? (
                  <UserNav />
                ) : (
                  <>
                    <UserPlus
                      onClick={() => redirect('/auth/sign-up')}
                      size={ICON_SIZE.MD}
                      className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                    />

                    <LogInIcon
                      onClick={() => redirect('/auth/sign-in')}
                      size={ICON_SIZE.MD}
                      className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                    />
                  </>
                )}
              </nav>
            </div>
          </div>

          <div className="flex items-center justify-end mx-4 mt-1">
            <div
              onClick={toggleMenu}
              className="md:hidden transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 flex flex-col items-center gap-4 bg-background/95 backdrop-blur-md p-6 md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>

              <ThemeToggle />

              {data?.user ? (
                <UserNav />
              ) : (
                <>
                  <UserPlus
                    onClick={() => redirect('/auth/sign-up')}
                    size={18}
                    className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                  />

                  <LogInIcon
                    onClick={() => redirect('/auth/sign-in')}
                    size={18}
                    className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                  />
                </>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
