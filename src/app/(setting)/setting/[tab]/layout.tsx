'use client';

import { useSettingTabFeatureFlags } from '@/features/setting/hooks/useSettingTabFeatureFlags';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface TabLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tab: string }>;
}

export default function TabLayout({ children, params }: TabLayoutProps) {
  // Unwrap params Promise bằng React.use()
  const unwrappedParams = use(params);
  const { checkTabAccess } = useSettingTabFeatureFlags();

  useEffect(() => {
    try {
      // Sử dụng unwrappedParams đã được unwrap
      checkTabAccess(unwrappedParams.tab);
    } catch {
      notFound();
    }
  }, [unwrappedParams.tab, checkTabAccess]);

  return <>{children}</>;
}
