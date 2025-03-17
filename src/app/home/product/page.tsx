import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const ProductPage = dynamic(
  () => import('@/features/home/module/product/presentation/pages/ProductPage'),
  {
    loading: () => <Loading />,
  },
);

const page = async () => {
  return <ProductPage />;
};

export default page;
