import SettingSubTabContent from '@/features/setting/module/partner/presentation/components/SettingSubTabContent';
import { Metadata } from 'next';

interface SettingCreatePageProps {
  params: Promise<{ tab: string }>;
}

export const metadata: Metadata = {
  title: 'FIORA | Create Partner',
  description: 'FIORA - Create Partner',
};

export default async function SettingCreatePage({ params }: SettingCreatePageProps) {
  const { tab } = await params;

  return <SettingSubTabContent tab={tab} subTab="create" />;
}
