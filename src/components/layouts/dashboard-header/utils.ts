import { Icons } from '@/components/Icon';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { GrowthBook } from '@growthbook/growthbook';
import { BookIcon, InfoIcon, MailIcon, PlayCircleIcon } from 'lucide-react';

export type Language = 'vi' | 'en';
export type Currency = 'vnd' | 'usd';
export type MenuSettingItem = {
  label: string;
  icon: any;
  url: string;
  featureFlags?: FeatureFlags;
  role?: string;
};

export const menuSettingItems: MenuSettingItem[] = [
  {
    label: 'Products & Services',
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
  { label: 'Users', icon: Icons.users, url: '/users' },
  { label: 'Role & Permission', icon: Icons.clipboardList, url: '/setting' },
  { label: 'Landing Page', icon: Icons.dashboard, url: '/setting/landing', role: 'Admin' },
];

export const helpItems = [
  { label: 'FAQs', icon: BookIcon, url: '/' },
  { label: 'User Tutorials', icon: PlayCircleIcon, url: '/' },
  { label: 'About Us', icon: InfoIcon, url: '/' },
  { label: 'Contact Us', icon: MailIcon, url: '/' },
];

export const filterMenuItems = (
  items: MenuSettingItem[],
  gb: GrowthBook,
  userRole: string | undefined,
): MenuSettingItem[] => {
  return items.filter((item: MenuSettingItem) => {
    const hasFeatureFlag = !item.featureFlags || gb.isOn(item.featureFlags);
    const hasRoleAccess = !item.role || userRole === item.role;

    if (hasFeatureFlag && hasRoleAccess) {
      return item;
    }
    return false;
  });
};
