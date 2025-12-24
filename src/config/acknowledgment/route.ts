import { AcknowledgmentFeatureKey } from '@/shared/constants';

export const routeMapping: Record<string, string> = {
  // HOME PAGE
  '': AcknowledgmentFeatureKey.HOMEPAGE,
  '/': AcknowledgmentFeatureKey.HOMEPAGE,

  // PROFILE PAGE
  '/profile': AcknowledgmentFeatureKey.PROFILE,
};
