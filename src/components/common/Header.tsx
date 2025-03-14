'use client';

import AccountSettingModal from '@/features/landing/presentation/components/AccountModal';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, HelpCircle, Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchInput from '../SearchInput';
import { UserNav } from '../layouts/UserNav';
import SettingModal from '@/features/landing/presentation/components/SettingModal';

type HeaderProps = {
  onHandlePressHelp: () => void;
  onHandlePressSetting: () => void;
  onHandleAccountPress: () => void;
};

const menuItems = ({
  onHandlePressHelp,
  onHandlePressSetting,
  onHandleAccountPress,
}: HeaderProps) => [
  { href: '#Help', label: 'Help', icon: <HelpCircle size={18} />, onClick: onHandlePressHelp },
  {
    href: '/dashboard',
    label: 'Setting',
    icon: <Settings size={18} />,
    onClick: onHandlePressSetting,
  },
  { href: '#pricing', label: 'Pricing' },
  { href: '#account', label: 'Account', onClick: onHandleAccountPress },
];

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const [isSettingOpen, setIsSettingOpen] = useState(false); // State quản lý modal
  const [isAccountSettingOpen, setIsAccountSettingOpen] = useState(false); // State quản lý modal

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);
  const toggleSetting = () => setIsSettingOpen((prevState) => !prevState); // Toggle modal
  const toggleAccountSetting = () => setIsAccountSettingOpen((prevState) => !prevState); // Toggle modal

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-background/100 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
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

          <div className="relative mx-2 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg">
            <SearchInput />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {menuItems({
              onHandlePressHelp: () => {},
              onHandlePressSetting: toggleSetting,
              onHandleAccountPress: toggleAccountSetting,
            }).map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={item.onClick}
                  className="relative flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-4 py-2 group cursor-pointer"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Links */}
            {session ? (
              <UserNav handleSignOut={() => signOut({ callbackUrl: '/auth/sign-in' })} />
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
            <div className="container mx-auto px-4 py-4 space-y-4">
              {menuItems({
                onHandlePressHelp: () => {},
                onHandlePressSetting: toggleSetting,
                onHandleAccountPress: toggleAccountSetting,
              }).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-4 py-2"
                  onClick={toggleMenu}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 space-y-4">
                <Link
                  href="/auth/sign-in"
                  className="block text-base font-medium text-foreground hover:text-primary transition-colors duration-200 px-4 py-2"
                  onClick={toggleMenu}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex items-center text-base font-medium text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Sign up <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SettingModal isOpen={isSettingOpen} onClose={toggleSetting} />
      <AccountSettingModal isOpen={isAccountSettingOpen} onClose={toggleAccountSetting} />
    </header>
  );
}
