import SettingSubTabContent from '@/features/setting/module/partner/presentation/components/SettingSubTabContent';

interface SettingCreatePageProps {
  params: Promise<{ tab: string }>;
}

export default async function SettingCreatePage({ params }: SettingCreatePageProps) {
  const { tab } = await params;

  return <SettingSubTabContent tab={tab} subTab="create" />;
}
