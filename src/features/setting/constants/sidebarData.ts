import { NavItem } from '@/features/home/types/Nav.types';
import { MODULE } from '@/shared/constants';
import { RouteEnum } from '@/shared/constants/RouteEnum';

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
    title: 'Deposit FX',
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
    items: [
      {
        title: 'Membership',
        url: RouteEnum.CronjobMembership,
        icon: 'users',
      },
      {
        title: 'Referral',
        url: RouteEnum.CronjobReferral,
        icon: 'users',
      },
    ],
  },
];
