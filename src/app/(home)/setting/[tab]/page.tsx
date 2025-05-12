import { validTabs } from '@/features/setting/module/partner/data/constant';
import TabContent from '@/features/setting/module/partner/presentation/components/TabContent';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return validTabs.map((tab) => ({ tab }));
}

interface SettingsTabPageProps {
  params: Promise<{ tab: string }>;
}

export const metadata: Metadata = {
  title: 'FIORA | Partner Settings',
  description: 'FIORA - Partner Settings',
};

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;

  if (!validTabs.includes(tab as any)) {
    notFound();
  }

  return <TabContent tab={tab} />;
}
