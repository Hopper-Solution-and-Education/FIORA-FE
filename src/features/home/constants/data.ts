import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { NavItem } from '../types/Nav.types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/home',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: 'Finance',
    url: '#',
    icon: 'Wallet',
    isActive: false,
    items: [
      {
        title: 'Accounts',
        url: '/home/account',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      {
        title: 'Categories',
        url: '/home/category',
        icon: 'userPen',
        shortcut: ['m', 'm'],
        featureFlags: FeatureFlags.CATEGORY_FEATURE,
      },
      {
        title: 'Transaction',
        url: '/home/transaction',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      // {
      //   title: 'Budget Planning',
      //   url: '/home/budget-control',
      //   icon: 'userPen',
      //   shortcut: ['m', 'm'],
      // },
    ],
  },
];
