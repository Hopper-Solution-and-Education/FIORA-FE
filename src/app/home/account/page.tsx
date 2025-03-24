import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = () => {
  return <AccountDashboardRender />;
};

export default AccountPage;
