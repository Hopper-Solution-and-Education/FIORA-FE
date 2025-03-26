import { NavItem } from '../types/Nav.types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/home',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // Empty array as there are no child items for Dashboard
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
      },
      {
        title: 'Transaction History',
        url: '/home/transaction',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      {
        title: 'Budget Planning',
        url: '/home/budget-control',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
    ],
  },
  {
    title: 'Account',
    url: '#',
    icon: 'billing',
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/home/profile',
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
    items: [],
  },
];
