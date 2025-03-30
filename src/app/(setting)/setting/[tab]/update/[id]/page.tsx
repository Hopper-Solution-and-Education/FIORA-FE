import SettingSubTabContent from '@/features/setting/module/partner/presentation/components/SettingSubTabContent';

interface SettingUpdatePageProps {
  params: Promise<{ tab: string }>;
}

export default async function SettingUpdatePage({ params }: SettingUpdatePageProps) {
  const { tab } = await params;

  return <SettingSubTabContent tab={tab} subTab="update" />;
}
