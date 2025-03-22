'use client';

import AccountSettingModal from '@/features/landing/presentation/components/AccountModal';
import HopperLogo from '@public/images/logo.jpg';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Gift, HelpCircle, LogInIcon, Menu, Settings, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import HelpCenter from '@/components/layouts/theme-toggle/HelpCenter';
import LanguageToggle from '@/components/layouts/theme-toggle/LanguageToggle';
import ThemeToggle from '@/components/layouts/theme-toggle/ThemeToggle';
import { UserNav } from '@/components/layouts/UserNav';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionType } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { useGetSection } from '../../hooks/useGetSection';

export default function Header() {
  const { section, isLoading, isError } = useGetSection(SectionType.HEADER);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountSettingOpen, setIsAccountSettingOpen] = useState(false);
  const [isOpenAnountment, setIsOpenAnountment] = useState(true);

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);
  const toggleAccountSetting = () => setIsAccountSettingOpen((prevState) => !prevState);

  const handlePressSetting = () => {
    router.replace('/home/landing-settings');
  };

  return (
    <header
      className={`fixed bg-background/100 top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full max-w-screen`}
    >
      <div className="flex items-center justify-center">
        {/* Logo */}
        <div className="flex items-center mb-3">
          <Link href="/">
            {isLoading ? (
              <Skeleton className={`w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20`} />
            ) : (
              <>
                {section?.medias || !isError ? (
                  <Image
                    src={section?.medias[0]?.media_url || HopperLogo}
                    alt="Fiora Logo"
                    width={240}
                    height={240}
                    className={`object-contain w-16 h-16 md:w-20 md:h-20 ${isOpenAnountment ? 'lg:w-24 lg:h-full' : 'lg:w-20 lg:h-full'} `}
                    priority
                  />
                ) : (
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 bg-gray-200 rounded-full flex items-center justify-center`}
                  >
                    {/* Optional: Add a placeholder icon or text */}
                    <span>Logo</span>
                  </div>
                )}
              </>
            )}
          </Link>
        </div>

        <div className="flex items-center w-full">
          {/* Announcement and Navigation Container */}
          <div className="flex flex-col items-end w-full">
            {/* Announcement - Hidden on mobile */}
            {isOpenAnountment && (
              <div className="relative w-full">
                <Alert variant="default" className="rounded-none hidden md:block relative">
                  <AlertDescription>
                    This is an important announcement for all users.
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setIsOpenAnountment(false)}
                  >
                    ✕
                  </Button>
                </Alert>
              </div>
            )}

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-4 py-2 px-4">
              <HelpCenter />
              <ThemeToggle />
              <LanguageToggle />

              <Button
                onClick={() => redirect('/auth/sign-in')}
                variant="outline"
                size="icon"
                className="relative w-10 h-10"
              >
                <LogInIcon />
              </Button>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center gap-4 bg-background/95 backdrop-blur-md p-6 md:hidden"
          >
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Gift className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>Check your rewards</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>Help Center</DropdownMenuItem>
                <DropdownMenuItem>Contact Support</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handlePressSetting}>Landing Settings</DropdownMenuItem>
                <DropdownMenuItem>Security Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
            <UserNav />
          </motion.div>
        )}
      </AnimatePresence>

      <AccountSettingModal isOpen={isAccountSettingOpen} onClose={toggleAccountSetting} />
    </header>
  );
}
