import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const UserNotificationDetailPage = dynamic(
  () => import('@/features/notification/presentation/pages/UserNotificationDetailPage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <UserNotificationDetailPage />;
};

export default page;
