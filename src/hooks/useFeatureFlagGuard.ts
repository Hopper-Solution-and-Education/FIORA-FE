'use client';
import { MODULE } from '@/shared/constants';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useGrowthBook } from '@growthbook/growthbook-react';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export function useFeatureFlagGuard(feature: FeatureFlags, module: string | undefined = undefined) {
  const gb = useGrowthBook();
  const isFeatureOn: boolean = gb ? gb.isOn(feature) : false;
  const isLoaded: boolean = gb ? gb.ready : false;

  useEffect(() => {
    if (isLoaded && !isFeatureOn && module !== MODULE.HOME) {
      notFound();
    }
  }, [isLoaded, isFeatureOn, module]);

  return { isLoaded, isFeatureOn };
}
