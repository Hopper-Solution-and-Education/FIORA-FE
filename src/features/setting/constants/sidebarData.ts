import { NavItem } from '@/features/home/types/Nav.types';
import { MODULE, RouteEnum } from '@/shared/constants';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const settingNavItems: NavItem[] = [
  {
    title: 'Global Settings',
    url: '/setting',
    icon: 'settings',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    module: MODULE.HOME,
  },
  {
    title: 'Landing Page',
    url: '/setting/landing',
    icon: 'dashboard',
    isActive: false,
  },
  {
    title: 'Exchange Rate',
    url: '/setting/exchange-rate',
    icon: 'circleDollarSign',
    isActive: false,
  },
  {
    title: 'Membership',
    url: '/setting/membership',
    icon: 'users',
    isActive: false,
  },
  {
    title: 'FX Request',
    url: '/setting/wallet',
    icon: 'coins',
    isActive: false,
  },
  {
    title: 'Notification',
    url: '/setting/notification',
    icon: 'bell',
    isActive: false,
  },
  {
    title: 'Package FX',
    url: '/setting/packagefx',
    icon: 'package',
    isActive: false,
  },
  {
    title: 'Cron Job',
    url: RouteEnum.CronjobMembership,
    icon: 'pickaxe',
    isActive: false,
    items: [
      {
        title: 'Membership',
        url: RouteEnum.CronjobMembership,
        icon: 'users',
        isActive: false,
      },
      {
        title: 'Flexi Interest',
        url: RouteEnum.FlexiInterest,
        icon: 'moon',
        isActive: false,
      },
      {
        title: 'Referral',
        url: RouteEnum.CronjobReferral,
        icon: 'userPlus',
      },
      {
        title: 'Saving Interest',
        url: RouteEnum.CronjobSavingInterest,
        icon: 'moonStar',
      },
    ],
  },
];
