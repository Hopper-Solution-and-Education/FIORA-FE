import SettingSubTabContent from '@/features/setting/module/partner/presentation/components/SettingSubTabContent';
import { Metadata } from 'next';

interface SettingUpdatePageProps {
  params: Promise<{ tab: string }>;
}

export const metadata: Metadata = {
  title: 'FIORA | Update Partner',
  description: 'FIORA - Update Partner',
};

export default async function SettingUpdatePage({ params }: SettingUpdatePageProps) {
  const { tab } = await params;
  return <SettingSubTabContent tab={tab} subTab="update" />;
}
