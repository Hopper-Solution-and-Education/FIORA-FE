// File: /setting/[tab]/TabContent.tsx
'use client';

import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';

const AccountSettingPageRender = dynamic(
  () => import('@/features/setting/presentation/module/account/AccountSettingPage'),
  { loading: () => <div>Loading...</div> },
);

const PartnerSettingPageRender = dynamic(
  () => import('@/features/setting/presentation/module/partner/PartnerSettingPage'),
  { loading: () => <div>Loading...</div> },
);

// Define tab configurations in an object
const tabConfig = {
  account: {
    title: 'Account',
    description: 'Update your account settings. Set your preferred language and timezone.',
    component: <AccountSettingPageRender />,
  },
  partner: {
    title: 'Partner',
    description: 'Manage your partner settings.',
    component: <PartnerSettingPageRender />,
  },
};

// Define a type for tab keys
type TabKey = keyof typeof tabConfig;

interface TabContentProps {
  tab: string;
}

export default function TabContent({ tab }: TabContentProps) {
  const tabInfo = tabConfig[tab as TabKey] || {
    title: 'Unknown',
    description: 'This tab does not exist.',
    component: <p>Invalid tab selected.</p>,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{tabInfo.title}</h3>
        <p className="text-sm text-muted-foreground">{tabInfo.description}</p>
      </div>
      <Separator />
      {tabInfo.component}
    </div>
  );
}
