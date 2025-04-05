import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { NavItem } from '../types/Nav.types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: 'Finance',
    url: '#',
    icon: 'wallet',
    isActive: false,
    items: [
      {
        title: 'Accounts',
        url: '/account',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      {
        title: 'Categories',
        url: '/category',
        icon: 'userPen',
        shortcut: ['m', 'm'],
        featureFlags: FeatureFlags.CATEGORY_FEATURE,
      },
      {
        title: 'Transaction',
        url: '/transaction',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      // {
      //   title: 'Budget Planning',
      //   url: '/budget-control',
      //   icon: 'userPen',
      //   shortcut: ['m', 'm'],
      // },
    ],
  },
];
