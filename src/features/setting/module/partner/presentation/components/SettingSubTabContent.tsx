'use client';

import { notFound } from 'next/navigation';
import { SettingSubTabComponentProps } from '@/features/setting/presentation/types';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import Loading from '@/components/common/atoms/Loading';

const PartnerCreatePage = dynamic(
  () => import('@/features/setting/module/partner/presentation/components/PartnerCreatePage'),
  { loading: () => <Loading /> },
);

const PartnerUpdatePage = dynamic(
  () => import('@/features/setting/module/partner/presentation/components/PartnerUpdatePage'),
  { loading: () => <Loading /> },
);

const subTabConfig = {
  partner: {
    create: {
      component: PartnerCreatePage,
    },
    update: {
      component: PartnerUpdatePage,
    },
  },
} as const;

type TabKey = keyof typeof subTabConfig;
type SubTabKey<T extends TabKey> = keyof (typeof subTabConfig)[T];

interface SettingSubTabContentProps {
  tab: string;
  subTab: string;
}

export default function SettingSubTabContent({ tab, subTab }: SettingSubTabContentProps) {
  const isValidTab = (tab: string): tab is TabKey => tab in subTabConfig;
  const isValidSubTab = (tab: TabKey, subTab: string): subTab is SubTabKey<typeof tab> =>
    subTab in subTabConfig[tab];

  if (!isValidTab(tab)) {
    notFound();
  }

  const tabConfig = subTabConfig[tab];
  const tabInfo = isValidSubTab(tab, subTab) ? tabConfig[subTab] : null;

  if (!tabInfo) {
    notFound();
  }

  const Component = tabInfo.component as ComponentType<SettingSubTabComponentProps>;

  return <Component />;
}
