import { configureServerSideGrowthBook } from '@/config/growthbook/growthbookServer';
import growthbook from '@/config/growthbook/growthbook';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { validTabs } from '@/features/setting/module/partner/data/constant';
import { notFound } from 'next/navigation';

configureServerSideGrowthBook();
const gb = growthbook;

const tabFeatureMapping = {
  partner: FeatureFlags.PARTNER_FEATURE,
};

export function useSettingTabFeatureFlags() {
  const isTabEnabled = (tab: string): boolean => {
    return (
      tab in tabFeatureMapping && gb.isOn(tabFeatureMapping[tab as keyof typeof tabFeatureMapping])
    );
  };

  /**
   * Get all enabled tabs
   */
  const getEnabledTabs = (): string[] => {
    return Object.keys(tabFeatureMapping).filter((tab) => isTabEnabled(tab));
  };

  /**
   * Check tab access and throw notFound if not accessible
   */
  const checkTabAccess = (tab: string) => {
    if (!validTabs.includes(tab as any) || !isTabEnabled(tab)) {
      notFound();
    }
  };

  /**
   * Check if a specific feature flag is enabled
   */
  const isFeatureEnabled = (featureFlag: string): boolean => {
    return gb.isOn(featureFlag);
  };

  return {
    isTabEnabled,
    getEnabledTabs,
    isFeatureEnabled,
    checkTabAccess,
    tabFeatureMapping,
  };
}
