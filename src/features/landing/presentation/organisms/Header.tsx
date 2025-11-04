'use client';

import HopperLogo from '@public/images/logo.jpg';
import { AnimatePresence } from 'framer-motion';
import { LogInIcon, Menu, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { UserNav } from '@/components/layouts';
import HelpCenter from '@/components/layouts/DashboardHeader/components/HelpCenter';
import MarqueeAnnouncement from '@/components/layouts/DashboardHeader/components/MarqueAnnouncement';
import NewsCenter from '@/components/layouts/DashboardHeader/components/NewsCenter';
import {
  default as SettingCenter,
  default as ThemeToggle,
} from '@/components/layouts/DashboardHeader/components/SettingCenter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { ICON_SIZE } from '@/shared/constants/size';
import useAnnouncementManager from '@/shared/hooks/useAnnouncementManager';
import { useSession } from 'next-auth/react';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';
import { NavItem } from '../atoms/NavItem';

export default function Header() {
  const { section, isLoading } = useGetSection(SectionTypeEnum.HEADER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useSession();

  const {
    announcement,
    show: showAnnouncement,
    handleClose: handleCloseAnnouncement,
  } = useAnnouncementManager();

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);

  const logo = section?.medias?.[0]?.media_url || HopperLogo;

  return (
    <header id="app-header" className={`app-bar bg-background/100 shadow-lg relative`}>
      <div className="flex items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            {isLoading ? (
              <Skeleton className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] h-[40px] sm:h-[45px] md:h-[50px] lg:h-[55px] xl:h-[60px]" />
            ) : (
              <div className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] h-[40px] sm:h-[45px] md:h-[50px] lg:h-[60px] xl:h-[80px] relative">
                <Image src={logo} alt="Fiora Logo" fill className="object-contain" priority />
              </div>
            )}
          </Link>
        </div>

        <div className="w-full h-full">
          <div className="w-full">
            {showAnnouncement && announcement?.data?.[0]?.content && !isLoading && (
              <div className="flex items-center justify-between w-full">
                <MarqueeAnnouncement className="text-sm w-full text-red-700">
                  {announcement?.data?.[0]?.content}
                </MarqueeAnnouncement>

                <Button variant="ghost" size="icon" onClick={handleCloseAnnouncement}>
                  ✕
                </Button>
              </div>
            )}

            <div className="flex w-full justify-end">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6 px-8">
                <NewsCenter />
                <HelpCenter />
                <SettingCenter />

                {data?.user ? (
                  <CommonTooltip content="User Menu">
                    <UserNav />
                  </CommonTooltip>
                ) : (
                  <>
                    <Link href={RouteEnum.SignUp}>
                      <NavItem
                        label="Sign Up"
                        icon={
                          <UserPlus
                            size={ICON_SIZE.MD}
                            className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                          />
                        }
                      />
                    </Link>
                    <Link href={RouteEnum.SignIn}>
                      <NavItem
                        label="Sign In"
                        icon={
                          <LogInIcon
                            size={ICON_SIZE.MD}
                            className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                          />
                        }
                      />
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>

          <div className="flex items-center justify-end mx-4 mt-1">
            <CommonTooltip content="Menu">
              <div
                onClick={toggleMenu}
                className="md:hidden transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </CommonTooltip>
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
                  <Link href={RouteEnum.SignUp}>
                    <NavItem
                      label="Sign Up"
                      tooltip="Sign Up"
                      icon={
                        <UserPlus
                          size={24}
                          className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                        />
                      }
                    />
                  </Link>
                  <Link href={RouteEnum.SignIn}>
                    <NavItem
                      label="Sign In"
                      tooltip="Sign In"
                      icon={
                        <LogInIcon
                          size={24}
                          className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                        />
                      }
                    />
                  </Link>
                </>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
