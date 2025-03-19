// File: /setting/[tab]/TabContent.tsx
'use client';

import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';

// Dynamically import the AccountSettingPageRender component
const AccountSettingPageRender = dynamic(
  () => import('@/features/setting/presentation/module/account/AccountSettingPage'),
  {
    loading: () => <div>Loading...</div>,
  },
);

interface TabContentProps {
  tab: string;
}

export default function TabContent({ tab }: TabContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{tab.charAt(0).toUpperCase() + tab.slice(1)}</h3>
        <p className="text-sm text-muted-foreground">
          {tab === 'account'
            ? 'Update your account settings. Set your preferred language and timezone.'
            : 'Manage your partner settings.'}
        </p>
      </div>
      <Separator />
      {tab === 'account' ? <AccountSettingPageRender /> : <p>This is the {tab} settings page.</p>}
    </div>
  );
}
