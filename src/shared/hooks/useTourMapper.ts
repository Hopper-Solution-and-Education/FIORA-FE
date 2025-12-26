import { routeMapping } from '@/config/acknowledgment';
import { AcknowledgmentFeatureKey } from '@/shared/constants';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function useTourMapper(): AcknowledgmentFeatureKey | null {
  const pathname = (usePathname() || '').replace(/\/+$/, '');

  return useMemo(() => {
    const featureKeyMapping = routeMapping[pathname];

    return featureKeyMapping as AcknowledgmentFeatureKey | null;
  }, [pathname]);
}
