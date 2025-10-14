import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const UserManagementPage = dynamic(
  () => import('@/features/setting/module/user-management/presentation/pages/UserManagementPage'),
  {
    loading: () => <Loading />,
  },
);

export default function Page() {
  return <UserManagementPage />;
}