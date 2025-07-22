import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const NotificationSettingPage = dynamic(
  () => import('@/features/setting/module/notification/presentation/pages/NotificationSettingPage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <NotificationSettingPage />;
};

export default page;
