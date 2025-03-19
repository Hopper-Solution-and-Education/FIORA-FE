// File: /setting/[tab]/page.tsx
import { notFound } from 'next/navigation';
import TabContent from '@/features/setting/presentation/components/TabContent';

// Define the list of valid tabs
const validTabs = ['account', 'partner'];

// Use generateStaticParams to pre-generate static routes for each tab
export async function generateStaticParams() {
  return validTabs.map((tab) => ({
    tab,
  }));
}

interface SettingsTabPageProps {
  params: {
    tab: string;
  };
}

export default function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = params;

  if (!validTabs.includes(tab)) {
    notFound();
  }

  return <TabContent tab={tab} />;
}
