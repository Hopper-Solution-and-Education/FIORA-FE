import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { NavItem } from '../types/Nav.types';
import { MODULE } from '@/shared/constants';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    module: MODULE.HOME,
  },
  {
    title: 'Finance',
    url: '/finance/chart',
    icon: 'wallet',
    isActive: false,
    items: [
      {
        title: 'Accounts',
        url: '/account',
        icon: 'banknote',
        shortcut: ['m', 'm'],
        module: MODULE.ACCOUNT,
      },
      {
        title: 'Categories',
        url: '/category',
        icon: 'package',
        shortcut: ['m', 'm'],
        featureFlags: FeatureFlags.CATEGORY_FEATURE,
      },
      {
        title: 'Budgets',
        url: '/budgets',
        icon: 'chartBar',
        shortcut: ['m', 'm'],
      },
      {
        title: 'Transaction',
        url: '/transaction',
        icon: 'shoppingCart',
        shortcut: ['m', 'm'],
      },
    ],
  },
];
