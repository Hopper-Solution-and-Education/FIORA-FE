'use client';

import HopperLogo from '@public/images/logo.jpg';
import { AnimatePresence } from 'framer-motion';
import { LogInIcon, Menu, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import HelpCenter from '@/components/layouts/dashboard-header/HelpCenter';
import MarqueeAnnouncement from '@/components/layouts/dashboard-header/MarqueAnnouncement';
import {
  default as SettingCenter,
  default as ThemeToggle,
} from '@/components/layouts/dashboard-header/SettingCenter';
import { UserNav } from '@/components/layouts/user-nav/UserNav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import useAnnouncementManager from '@/shared/hooks/useAnnouncementManager';
import { useSession } from 'next-auth/react';
import { SectionTypeEnum } from '../../constants';
import { useGetSection } from '../../hooks/useGetSection';

export default function Header() {
  const { section, isLoading } = useGetSection(SectionTypeEnum.HEADER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  const {
    announcement,
    show: showAnnouncement,
    handleClose: handleCloseAnnouncement,
  } = useAnnouncementManager();

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);

  const logo = section?.medias?.[0]?.media_url || HopperLogo;

  const handleSignUp = () => {
    router.push('/auth/sign-up');
  };

  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };

  return (
    <TooltipProvider delayDuration={150}>
      <header
        className={`fixed bg-background/100 top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out shadow-lg`}
      >
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
                <nav className="hidden md:flex items-center gap-8 px-8">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <HelpCenter />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Help Center</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <SettingCenter />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>

                  {data?.user ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <UserNav />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>User Menu</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <UserPlus
                            onClick={handleSignUp}
                            size={ICON_SIZE.MD}
                            className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sign Up</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <LogInIcon
                            onClick={handleSignIn}
                            size={ICON_SIZE.MD}
                            className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sign In</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </nav>
              </div>
            </div>

            <div className="flex items-center justify-end mx-4 mt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={toggleMenu}
                    className="md:hidden transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                    aria-label="Toggle menu"
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Menu</p>
                </TooltipContent>
              </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <UserPlus
                          onClick={handleSignUp}
                          size={18}
                          className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign Up</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <LogInIcon
                          onClick={handleSignIn}
                          size={18}
                          className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign In</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </TooltipProvider>
  );
}
