import { GlobalNavItem } from '@/shared/types/GlobalNav.types';

export const globalNavItems: GlobalNavItem[] = [
  {
    title: 'Profile',
    url: '#profile',
    icon: 'dashboard',
    props: { size: 20, strokeWidth: 1 },
    isActive: false,
    shortcut: ['d', 'd'],
  },
  {
    title: 'Expense/Income',
    url: '/setting/category',
    icon: 'banknote',
    props: { size: 20, strokeWidth: 1 },
    shortcut: ['p', 'p'],
    isActive: false,
  },
  {
    title: 'Billing',
    url: '#billing',
    icon: 'billing',
    props: { size: 20, strokeWidth: 1 },
    isActive: true,
  },
  {
    title: 'Settings',
    url: '#settings',
    icon: 'settings',
    props: { size: 20, strokeWidth: 1 },
    isActive: true,
  },
];
