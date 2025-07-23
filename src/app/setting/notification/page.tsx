import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const NotificationDashboardPageRender = dynamic(
  () =>
    import(
      '@/features/setting/module/notification-dashboard/presentation/pages/NotificationDashboardPage'
    ),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <NotificationDashboardPageRender />;
};

export default page;
