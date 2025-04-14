'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';
import { MODULE } from '@/shared/constants';

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = () => {
  return <AccountDashboardRender module={MODULE.ACCOUNT} />;
};

export default AccountPage;
