import { validTabs } from '@/features/setting/module/partner/data/constant';
import TabContent from '@/features/setting/module/partner/presentation/components/TabContent';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return validTabs.map((tab) => ({ tab }));
}

interface SettingsTabPageProps {
  params: Promise<{ tab: string }>;
}

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;

  if (!validTabs.includes(tab as any)) {
    notFound();
  }

  return <TabContent tab={tab} />;
}
