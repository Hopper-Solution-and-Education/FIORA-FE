import { Icons } from '@/components/Icon';
import { FeatureFlags } from '@/shared/constants';
import { GrowthBook } from '@growthbook/growthbook';
import {
  BookIcon,
  InfoIcon,
  MailIcon,
  NewspaperIcon,
  PlayCircleIcon,
  ScrollTextIcon,
} from 'lucide-react';

export type Language = 'vi' | 'en';
export type Currency = 'vnd' | 'usd';
export type MenuSettingItem = {
  label: string;
  shortLabel?: string;
  icon: any;
  url: string;
  featureFlags?: FeatureFlags;
  role?: string | string[];
};

export const menuSettingItems: MenuSettingItem[] = [
  {
    label: 'Products & Services',
    shortLabel: 'Products',
    icon: Icons.package,
    url: '/setting/product',
    featureFlags: FeatureFlags.PRODUCT_FEATURE,
  },
  {
    label: 'Partners',
    icon: Icons.handShake,
    url: '/setting/partner',
    featureFlags: FeatureFlags.PARTNER_FEATURE,
  },
  { label: 'Users', icon: Icons.users, url: '/setting/user' },
  {
    label: 'Role & Permission',
    shortLabel: 'Role',
    icon: Icons.clipboardList,
    url: '/setting/role-permission',
  },
  {
    label: 'Global Setting',
    shortLabel: 'Global',
    icon: Icons.dashboard,
    url: '/setting/landing',
    role: 'Admin',
  },
  {
    label: 'User Management',
    shortLabel: 'Management',
    icon: Icons.shieldCheck,
    url: '/setting/user-management',
    role: ['Admin', 'CS'],
  },
];

export const helpItems = [
  { label: 'FAQs', shortLabel: 'FAQs', icon: BookIcon, url: '/helps-center/faqs' },
  {
    label: 'User Tutorials',
    shortLabel: 'Tutorials',
    icon: PlayCircleIcon,
    url: '/helps-center/user-tutorial',
  },
  { label: 'About Us', shortLabel: 'About', icon: InfoIcon, url: '/helps-center/about-us' },
  { label: 'Contact Us', shortLabel: 'Contact', icon: MailIcon, url: '/helps-center/contact-us' },
  {
    label: 'Terms and Conditions',
    shortLabel: 'Terms',
    icon: ScrollTextIcon,
    url: '/helps-center/terms-and-conditions',
  },
];

export const newsItems = [{ label: 'News', icon: NewspaperIcon, url: '/news' }];

export const filterMenuItems = (
  items: MenuSettingItem[],
  gb: GrowthBook,
  userRole: string | undefined,
): MenuSettingItem[] => {
  return items.filter((item: MenuSettingItem) => {
    const hasFeatureFlag = !item.featureFlags || gb.isOn(item.featureFlags);

    // Check role access: handle both string and array
    const hasRoleAccess =
      !item.role ||
      (Array.isArray(item.role) ? item.role.includes(userRole || '') : userRole === item.role);

    if (hasFeatureFlag && hasRoleAccess) {
      return item;
    }
    return false;
  });
};
