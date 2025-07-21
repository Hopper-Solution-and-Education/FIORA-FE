import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const NotificationDashboardPage = dynamic(
  () =>
    import(
      '@/features/setting/module/notification-dashboard/presentation/pages/NotificationDashboardPage'
    ),
  {
    loading: () => <Loading />,
  },
);

export default function NotificationPage() {
  return <NotificationDashboardPage />;
}
