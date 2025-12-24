import { routeMapping } from '@/config/acknowledgment';
import { FeatureKey } from '@/config/acknowledgment/pages';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function useTourMapper(): FeatureKey | null {
  const pathname = (usePathname() || '').replace(/\/+$/, '');

  return useMemo(() => {
    const featureKeyMapping = routeMapping[pathname];

    return featureKeyMapping as FeatureKey | null;
  }, [pathname]);
}
