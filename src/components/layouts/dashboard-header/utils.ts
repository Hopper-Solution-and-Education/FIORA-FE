import { Icons } from '@/components/Icon';
import { BookIcon, InfoIcon, MailIcon, PlayCircleIcon } from 'lucide-react';

export type Language = 'vi' | 'en';
export type Currency = 'vnd' | 'usd';

export const menuSettingItems = [
  { label: 'Products & Services', icon: Icons.package, url: '/setting/product' },
  { label: 'Partners', icon: Icons.handShake, url: '/setting/partner' },
  { label: 'Users', icon: Icons.users, url: '/users' },
  { label: 'Role & Permission', icon: Icons.clipboardList, url: '/setting' },
  { label: 'Landing Settings', icon: Icons.dashboard, url: '/setting/landing', role: 'Admin' },
];

export const helpItems = [
  { label: 'FAQs', icon: BookIcon, url: '/faqs' },
  { label: 'User Tutorials', icon: PlayCircleIcon, url: '/' },
  { label: 'About Us', icon: InfoIcon, url: '/' },
  { label: 'Contact Us', icon: MailIcon, url: '/' },
];
