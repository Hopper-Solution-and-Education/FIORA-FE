'use client';

import AccountSettingModal from '@/features/landing/presentation/components/AccountModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronRight, Gift, HelpCircle, Menu, Settings, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from '../layouts/theme-toggle/ThemeToggle';
import { UserNav } from '../layouts/UserNav';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function Header() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-background/80' : 'bg-background/100'
      }`}
    >
      {/* Announcement */}
      <Alert variant="default" className="rounded-none">
        <AlertTitle>Announcement</AlertTitle>
        <AlertDescription>This is an important announcement for all users.</AlertDescription>
      </Alert>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold">
              <span className="text-primary">Fiora</span>
            </Link>
          </motion.div>

          {/* Navigation and Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex justify-center gap-10 items-center">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Bell className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Gift className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Check your rewards</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePressSetting}>
                      Landing Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>Security Settings</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ThemeToggle />

                {session ? (
                  <UserNav />
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="hidden sm:inline-flex text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                    >
                      Log in
                    </Link>

                    <Link
                      href="/auth/sign-up"
                      className="hidden sm:inline-flex items-center text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors duration-200"
                    >
                      Sign up <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </>
                )}
              </div>
            </nav>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              {/* Mobile Menu Button */}
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-2 p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Gift className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Check your rewards</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePressSetting}>Landing Settings</DropdownMenuItem>
                  <DropdownMenuItem>Security Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
              <UserNav />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AccountSettingModal isOpen={isAccountSettingOpen} onClose={toggleAccountSetting} />
    </header>
  );
}
