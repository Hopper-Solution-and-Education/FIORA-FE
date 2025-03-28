'use client';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useGrowthBook } from '@growthbook/growthbook-react';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export function useFeatureFlagGuard(feature: FeatureFlags) {
  const gb = useGrowthBook();
  const isFeatureOn: boolean = gb ? gb.isOn(feature) : false;
  const isLoaded: boolean = gb ? gb.ready : false;

  useEffect(() => {
    if (isLoaded && !isFeatureOn) {
      notFound();
    }
  }, [isLoaded, isFeatureOn]);

  return { isLoaded, isFeatureOn };
}
