'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { TabComponentProps } from '../../../../presentation/types';
import Loading from '@/components/common/atoms/Loading';

const PartnerSettingPageRender = dynamic(
  () => import('@/features/setting/module/partner/presentation/pages/PartnerSettingPage'),
  { loading: () => <Loading /> },
);

// Define tab configurations in an object
const tabConfig = {
  partner: {
    title: 'Partner',
    description: 'Manage your partner settings.',
    component: PartnerSettingPageRender,
  },
} as const;

type TabKey = keyof typeof tabConfig;

interface TabContentProps {
  tab: string;
}

export default function TabContent({ tab }: TabContentProps) {
  const isValidTab = (tab: string): tab is TabKey => tab in tabConfig;

  const tabInfo = isValidTab(tab)
    ? tabConfig[tab]
    : {
        title: 'Unknown',
        description: 'This tab does not exist.',
        component: () => <p>Invalid tab selected.</p>,
      };

  const Component = tabInfo.component as ComponentType<TabComponentProps>;

  return <Component title={tabInfo.title} description={tabInfo.description} />;
}
