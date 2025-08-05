import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const EditPackagePageRender = dynamic(
  () => import('@/features/setting/module/packagefx/pages/EditPackagePage'),
  {
    loading: () => <Loading />,
  },
);

export default function Page({ params }: { params: { id: string } }) {
  return <EditPackagePageRender packageId={params.id} />;
}
