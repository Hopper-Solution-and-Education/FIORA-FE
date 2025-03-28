import { notFound } from 'next/navigation';
import TabContent from '@/features/setting/presentation/components/TabContent';
import { configureServerSideGrowthBook } from '@/config/growthbookServer';
import growthbook from '@/config/growthbook';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

configureServerSideGrowthBook();
const gb = growthbook;
const partnerFeature = gb.isOn(FeatureFlags.PARTNER_FEATURE);

const validTabs = ['partner'] as const;

export function generateStaticParams() {
  return validTabs.map((tab) => ({ tab }));
}

interface SettingsTabPageProps {
  params: Promise<{ tab: string }>;
}

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;

  if (!validTabs.includes(tab as any) || !partnerFeature) {
    notFound();
  }

  return <TabContent tab={tab} />;
}
