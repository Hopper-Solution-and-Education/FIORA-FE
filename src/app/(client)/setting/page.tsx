import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';

const AccountSettingPageRender = dynamic(
  () => import('@/features/setting/presentation/module/account/AccountSettingPage'),
  {
    loading: () => <div>Loading...</div>,
  },
);

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and timezone.
        </p>
      </div>
      <Separator />
      <AccountSettingPageRender />
    </div>
  );
}
