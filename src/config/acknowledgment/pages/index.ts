import { AcknowledgmentFeatureKey } from '@/shared/constants';

export const featureMap = {
  [AcknowledgmentFeatureKey.HOMEPAGE]: () => import('./homepage'),
  [AcknowledgmentFeatureKey.PROFILE]: () => import('./profile'),
} as const;

export type FeatureKey = keyof typeof featureMap;
