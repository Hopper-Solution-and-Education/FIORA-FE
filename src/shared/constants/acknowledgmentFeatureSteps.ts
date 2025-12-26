import { Step4Config } from '../types';

export enum AcknowledgmentFeatureKey {
  HOMEPAGE = 'homepage_tour',
  PROFILE = 'profile_tour',
}

export const AcknowledgmentFeatureSteps: Record<AcknowledgmentFeatureKey, Step4Config[]> = {
  [AcknowledgmentFeatureKey.HOMEPAGE]: [
    {
      selector: '[data-tour="homepage-logo"]',
      side: 'right',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-finance-summary"]',
      side: 'bottom',
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-notification"]',
      side: 'bottom-right',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-rewards"]',
      side: 'left-top',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-news"]',
      side: 'left-top',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-help-center"]',
      side: 'left-top',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-setting-center"]',
      side: 'left-top',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-user-nav"]',
      side: 'left-top',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-deposit-button"]',
      side: 'left',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-transfer-button"]',
      side: 'left',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-withdraw-button"]',
      side: 'left',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-account-dashboard"]',
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-recent-transactions"]',
      side: 'left',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="homepage-finance-chart"]',
      side: 'top',
      pointerPadding: 10,
      pointerRadius: 10,
    },
  ],
  [AcknowledgmentFeatureKey.PROFILE]: [
    {
      selector: '[data-tour="profile-personal-info-section"]',
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      selector: '[data-tour="profile-personal-info-details"]',
      side: 'bottom',
      pointerRadius: 10,
    },
  ],
};
