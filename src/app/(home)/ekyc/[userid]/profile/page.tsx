import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ProfileEkycPage = dynamic(
  () => import('@/features/profile/presentation/modules/eKyc/profile/ProfileEkycPage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <ProfileEkycPage />;
};

export default page;
