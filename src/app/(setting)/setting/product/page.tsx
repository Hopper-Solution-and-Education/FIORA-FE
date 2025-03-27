'use client';
import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const ProductPage = dynamic(() => import('@/features/setting/module/product'), {
  loading: () => <Loading />,
});

const page = async () => {
  return <ProductPage />;
};

export default page;
