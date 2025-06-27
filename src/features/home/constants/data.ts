import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { NavItem } from '../types/Nav.types';
import { MODULE } from '@/shared/constants';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const expandNavItems: NavItem[] = [
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
    url: '/finance/report',
    icon: 'chartColumn',
    isActive: false,
    items: [
      {
        title: 'Wallet',
        url: '/wallet',
        icon: 'wallet',
        shortcut: ['m', 'm'],
        module: MODULE.ACCOUNT,
      },
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
        icon: 'kanban',
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

export const shrinkNavItems: NavItem[] = [
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
    url: '/finance/report',
    icon: 'chartColumn',
    isActive: false,
  },
  {
    title: 'Wallet',
    url: '/wallet',
    icon: 'wallet',
    shortcut: ['m', 'm'],
    module: MODULE.ACCOUNT,
  },
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
    icon: 'kanban',
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
];

// Export navItems as alias for expandNavItems to maintain backward compatibility
export const navItems = expandNavItems;
