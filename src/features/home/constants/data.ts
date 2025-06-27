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
    url: '/finance/report',
    icon: 'wallet',
    isActive: false,
    items: [
      {
        title: 'Wallet',
        url: '/wallet',
        icon: 'wallet',
        shortcut: ['m', 'm'],
        module: MODULE.ACCOUNT,
        featureFlags: FeatureFlags.WALLET_FEATURE,
      },
      {
        title: 'Accounts',
        url: '/account',
        icon: 'banknote',
        shortcut: ['m', 'm'],
        module: MODULE.ACCOUNT,
        featureFlags: FeatureFlags.ACCOUNT_FEATURE,
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
        featureFlags: FeatureFlags.BUDGET_FEATURE,
      },
      {
        title: 'Transaction',
        url: '/transaction',
        icon: 'shoppingCart',
        shortcut: ['m', 'm'],
        featureFlags: FeatureFlags.TRANSACTION_FEATURE,
      },
    ],
  },
];
