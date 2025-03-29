import { NavItem } from '@/features/home/types/Nav.types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const SettingNavItems: NavItem[] = [
  {
    title: 'Partner',
    url: '/setting/partner',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: 'Product',
    url: '*',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Overview',
        url: '/setting/product',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Landing',
        url: '/setting/landing',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
    ],
  },
];
