import { notFound } from 'next/navigation';
import TabContent from '@/features/setting/presentation/components/TabContent';

// Define valid tabs
const validTabs = ['partner'] as const;

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
