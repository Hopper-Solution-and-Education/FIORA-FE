import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const MemberShipSettingPage = dynamic(
  () =>
    import('@/features/setting/module/membership/presentation/pages').then(
      (mod) => mod.MembershipSettingPage,
    ),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <MemberShipSettingPage />;
};

export default page;
