import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const MembershipPage = dynamic(
  () => import('@/features/home/module/membership/presentation/pages/MembershipPage'),
  {
    loading: () => <Loading />,
  },
);
export default function Page() {
  return <MembershipPage />;
}
