'use client';

import { useSettingTabFeatureFlags } from '@/features/setting/hooks/useSettingTabFeatureFlags';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';

interface TabLayoutProps {
  children: React.ReactNode;
  params: { tab: string };
}

export default function TabLayout({ children, params }: TabLayoutProps) {
  const { checkTabAccess } = useSettingTabFeatureFlags();

  useEffect(() => {
    try {
      checkTabAccess(params.tab);
    } catch {
      notFound();
    }
  }, [params.tab, checkTabAccess]);

  return <>{children}</>;
}
