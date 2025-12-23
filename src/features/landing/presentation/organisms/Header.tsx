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
    <header
      id="app-header"
      className={`app-bar bg-background/100 shadow-lg relative`}
      data-test="landing-header"
    >
      <div className="flex items-center" data-test="header-container">
        {/* Logo */}
        <div className="flex items-center" data-test="logo-container">
          <Link href="/" data-test="logo-link">
            {isLoading ? (
              <Skeleton
                className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] h-[40px] sm:h-[45px] md:h-[50px] lg:h-[55px] xl:h-[60px]"
                data-test="logo-skeleton"
              />
            ) : (
              <div
                className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] h-[40px] sm:h-[45px] md:h-[50px] lg:h-[60px] xl:h-[80px] relative"
                data-test="header-logo"
              >
                <Image
                  src={logo}
                  alt="Fiora Logo"
                  fill
                  className="object-contain"
                  priority
                  data-test="header-logo-image"
                />
              </div>
            )}
          </Link>
        </div>

        <div className="w-full h-full" data-test="header-content">
          <div className="w-full" data-test="announcement-container">
            {showAnnouncement && announcement?.data?.[0]?.content && !isLoading && (
              <div className="flex items-center justify-between w-full" data-test="announcement">
                <MarqueeAnnouncement
                  className="text-sm w-full text-red-700"
                  data-test="announcement-text"
                >
                  {announcement?.data?.[0]?.content}
                </MarqueeAnnouncement>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseAnnouncement}
                  data-test="announcement-close-button"
                >
                  ✕
                </Button>
              </div>
            )}

            <div className="flex w-full justify-end" data-test="nav-container">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6 px-8" data-test="header-nav">
                <NewsCenter data-test="news-center" />
                <HelpCenter data-test="help-center" />
                {data?.user && <SettingCenter data-test="setting-center" />}{' '}
                {data?.user ? (
                  <CommonTooltip content="User Menu" data-test="user-menu-tooltip">
                    <UserNav data-test="user-nav" />
                  </CommonTooltip>
                ) : (
                  <>
                    <Link href={RouteEnum.SignUp} data-test="signup-link">
                      <NavItem
                        label="Sign Up"
                        icon={
                          <UserPlus
                            size={ICON_SIZE.MD}
                            className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                            data-test="signup-icon"
                          />
                        }
                        data-test="signup-nav-item"
                      />
                    </Link>
                    <Link href={RouteEnum.SignIn} data-test="signin-link">
                      <NavItem
                        label="Sign In"
                        icon={
                          <LogInIcon
                            size={ICON_SIZE.MD}
                            className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                            data-test="signin-icon"
                          />
                        }
                        data-test="signin-nav-item"
                      />
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>

          <div
            className="flex items-center justify-end mx-4 mt-1"
            data-test="menu-toggle-container"
          >
            <CommonTooltip content="Menu" data-test="menu-tooltip">
              <div
                onClick={toggleMenu}
                className="md:hidden transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                aria-label="Toggle menu"
                data-test="menu-toggle"
              >
                {isMenuOpen ? (
                  <X size={20} data-test="menu-close-icon" />
                ) : (
                  <Menu size={20} data-test="menu-open-icon" />
                )}
              </div>
            </CommonTooltip>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end" data-test="mobile-menu-container">
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <div
              className="fixed inset-0 z-50 flex flex-col items-center gap-4 bg-background/95 backdrop-blur-md p-6 md:hidden"
              data-test="mobile-menu"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                data-test="mobile-menu-close-button"
              >
                <X className="h-6 w-6" data-test="mobile-menu-close-icon" />
              </Button>

              {data?.user ? (
                <>
                  <UserNav data-test="mobile-user-nav" />
                  <ThemeToggle data-test="mobile-theme-toggle" />
                </>
              ) : (
                <>
                  <Link href={RouteEnum.SignUp} data-test="mobile-signup-link">
                    <NavItem
                      label="Sign Up"
                      tooltip="Sign Up"
                      icon={
                        <UserPlus
                          size={24}
                          className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                          data-test="mobile-signup-icon"
                        />
                      }
                      data-test="mobile-signup-nav-item"
                    />
                  </Link>
                  <Link href={RouteEnum.SignIn} data-test="mobile-signin-link">
                    <NavItem
                      label="Sign In"
                      tooltip="Sign In"
                      icon={
                        <LogInIcon
                          size={24}
                          className="transition-all duration-200 group-hover:scale-110 group-hover:text-primary"
                          data-test="mobile-signin-icon"
                        />
                      }
                      data-test="mobile-signin-nav-item"
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
