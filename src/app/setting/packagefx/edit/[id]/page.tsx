import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const EditPackagePageRender = dynamic(
  () => import('@/features/setting/module/packagefx/pages/EditPackagePage'),
  {
    loading: () => <Loading />,
  },
);

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditPackagePageRender packageId={id} />;
}
