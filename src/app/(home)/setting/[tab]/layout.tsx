'use client';

import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { useSettingTabFeatureFlags } from '@/features/setting/hooks/useSettingTabFeatureFlags';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

interface TabLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tab: string }>;
}

export default function TabLayout({ children, params }: TabLayoutProps) {
  const unwrappedParams = use(params);
  const { checkTabAccess } = useSettingTabFeatureFlags();
  const router = useRouter();

  useEffect(() => {
    try {
      checkTabAccess(unwrappedParams.tab);
    } catch {
      router.push('/not-found');
    }
  }, [unwrappedParams.tab, checkTabAccess, router]);

  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.PARTNER_FEATURE}>{children}</ModuleAccessLayout>
  );
}
