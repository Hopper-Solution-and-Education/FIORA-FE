'use client';

import AccountSettingModal from '@/features/landing/presentation/components/AccountModal';
import HopperLogo from '@public/images/logo.jpg';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Gift, HelpCircle, LogInIcon, Menu, Settings, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { useGetSection } from '../../hooks/useGetSection';
import { SectionType } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import HelpCenter from '@/components/layouts/theme-toggle/HelpCenter';
import ThemeToggle from '@/components/layouts/theme-toggle/ThemeToggle';
import LanguageToggle from '@/components/layouts/theme-toggle/LanguageToggle';
import { UserNav } from '@/components/layouts/UserNav';

export default function Header() {
  const { section, isLoading, isError } = useGetSection(SectionType.HEADER);
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountSettingOpen, setIsAccountSettingOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);
  const toggleAccountSetting = () => setIsAccountSettingOpen((prevState) => !prevState);

  const handlePressSetting = () => {
    router.push('home/banner');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background/100'
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="relative flex items-center">
              {isLoading ? (
                <Skeleton className="w-16 h-16 md:w-20 md:h-20" />
              ) : (
                <>
                  {section?.medias || !isError ? (
                    <Image
                      src={section?.medias[0]?.media_url || HopperLogo}
                      alt="Fiora Logo"
                      width={240}
                      height={240}
                      className={`object-contain w-14 h-14 md:w-16 md:h-16 transition-all duration-300 ${
                        isScrolled ? 'scale-90' : 'scale-100'
                      }`}
                      priority
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">Logo</span>
                    </div>
                  )}
                </>
              )}
            </Link>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {session && (
                <>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent/50"
                      >
                        <Bell className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <div className="p-2 font-medium border-b">Notifications</div>
                      <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent/50"
                      >
                        <Gift className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="p-2 font-medium border-b">Rewards</div>
                      <DropdownMenuItem>Check your rewards</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent/50"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="p-2 font-medium border-b">Help</div>
                      <DropdownMenuItem>Help Center</DropdownMenuItem>
                      <DropdownMenuItem>Contact Support</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent/50"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2 font-medium border-b">Settings</div>
                      <DropdownMenuItem className="py-2">
                        <div className="flex items-center gap-2">
                          <span>Profile Settings</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2" onClick={handlePressSetting}>
                        <div className="flex items-center gap-2">
                          <span>Landing Settings</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2">
                        <div className="flex items-center gap-2">
                          <span>Security Settings</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                        <div className="flex items-center gap-2">
                          <span>Logout</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <div className="flex items-center gap-1 ml-1">
                <HelpCenter />
                <ThemeToggle />
                <LanguageToggle />

                {!session && (
                  <Button
                    onClick={() => redirect('/auth/sign-in')}
                    variant="default"
                    size="sm"
                    className="ml-2 rounded-full px-4"
                  >
                    <LogInIcon className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:hidden"
            >
              <Button
                onClick={toggleMenu}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent/50"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-md md:hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <Image
                  src={section?.medias[0]?.media_url || HopperLogo}
                  alt="Fiora Logo"
                  width={240}
                  height={240}
                  className="object-contain w-10 h-10"
                  priority
                />
                <span className="ml-2 font-semibold">Fiora</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {session ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start" size="lg">
                        <Bell className="h-5 w-5 mr-2" />
                        Notifications
                      </Button>
                      <Button variant="outline" className="justify-start" size="lg">
                        <Gift className="h-5 w-5 mr-2" />
                        Rewards
                      </Button>
                      <Button variant="outline" className="justify-start" size="lg">
                        <HelpCircle className="h-5 w-5 mr-2" />
                        Help Center
                      </Button>
                      <Button variant="outline" className="justify-start" size="lg">
                        <Settings className="h-5 w-5 mr-2" />
                        Settings
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handlePressSetting}
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Landing Settings
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="destructive" className="w-full">
                        <LogInIcon className="h-5 w-5 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="default" className="w-full" size="lg">
                    <LogInIcon className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <UserNav />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AccountSettingModal isOpen={isAccountSettingOpen} onClose={toggleAccountSetting} />
    </header>
  );
}
