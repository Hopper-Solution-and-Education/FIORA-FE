import { notFound } from 'next/navigation';
import TabContent from '@/features/setting/presentation/components/TabContent';

// Define valid tabs
const validTabs = ['account', 'partner'] as const;

export function generateStaticParams() {
  return validTabs.map((tab) => ({ tab }));
}

interface SettingsTabPageProps {
  params: Promise<{ tab: string }>;
}

// The page component must be async because params is a Promise
export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;

  if (!validTabs.includes(tab as any)) {
    notFound();
  }

  // Render the TabContent component with the resolved tab value
  return <TabContent tab={tab} />;
}
