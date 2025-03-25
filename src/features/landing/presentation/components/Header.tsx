'use client';

import AccountSettingModal from '@/features/landing/presentation/components/AccountModal';
import HopperLogo from '@public/images/logo.jpg';
import { AnimatePresence, motion } from 'framer-motion';
import { LogInIcon, Menu, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

import HelpCenter from '@/components/layouts/theme-toggle/HelpCenter';
import {
  default as SettingCenter,
  default as ThemeToggle,
} from '@/components/layouts/theme-toggle/SettingCenter';
import { UserNav } from '@/components/layouts/UserNav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionType } from '@prisma/client';
import { useGetSection } from '../../hooks/useGetSection';

export default function Header() {
  const { section, isLoading, isError } = useGetSection(SectionType.HEADER);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountSettingOpen, setIsAccountSettingOpen] = useState(false);
  const [isOpenAnountment, setIsOpenAnountment] = useState(true);

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);
  const toggleAccountSetting = () => setIsAccountSettingOpen((prevState) => !prevState);

  return (
    <header
      className={`fixed bg-background/100 top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex items-center">
        {/* Logo */}
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            {isLoading ? (
              <Skeleton className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px]" />
            ) : (
              <>
                {section?.medias || !isError ? (
                  <Image
                    src={section?.medias[0]?.media_url || HopperLogo}
                    alt="Fiora Logo"
                    width={240}
                    height={240}
                    className="object-contain w-auto max-w-[180px] md:max-w-[200px] lg:max-w-[240px] h-auto max-h-[80px]"
                    priority
                  />
                ) : (
                  <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] bg-gray-200 rounded-full flex items-center justify-center">
                    <span>Logo</span>
                  </div>
                )}
              </>
            )}
          </Link>
        </div>

        <div className="w-full items-center">
          <div className="w-full items-center px-2 justify-center">
            {isOpenAnountment && (
              <div className="flex justify-between">
                <div>This is an important announcement for all users.</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-gray-100"
                  onClick={() => setIsOpenAnountment(false)}
                >
                  ✕
                </Button>
              </div>
            )}
            <div className="flex w-full justify-end">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-4 px-4">
                <HelpCenter />
                <SettingCenter />

                <Button
                  onClick={() => redirect('/auth/sign-up')}
                  variant="outline"
                  size="icon"
                  className="relative w-10 h-10"
                >
                  <UserPlus />
                </Button>

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
          </div>

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
      <div className="flex items-center justify-center">
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

              <ThemeToggle />
              <UserNav />
            </motion.div>
          )}
        </AnimatePresence>

        <AccountSettingModal isOpen={isAccountSettingOpen} onClose={toggleAccountSetting} />
      </div>
    </header>
  );
}
