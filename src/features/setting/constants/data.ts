import { NavItem } from '@/features/home/types/Nav.types';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const SettingNavItems: NavItem[] = [
  {
    title: 'Partner',
    url: '/setting/partner',
    icon: 'userPen',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: 'Product',
    url: '/setting/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    featureFlags: FeatureFlags.PRODUCT_FEATURE,
    // items: [
    //   {
    //     title: 'Overview',
    //     url: '/setting/product',
    //     icon: 'userPen',
    //     featureFlags: FeatureFlags.PRODUCT_FEATURE,
    //     shortcut: ['m', 'm'],
    //   },
    // ],
  },
  {
    title: 'Landing',
    url: '/setting/landing',
    icon: 'layoutBanner',
    isActive: false,
  },
];
