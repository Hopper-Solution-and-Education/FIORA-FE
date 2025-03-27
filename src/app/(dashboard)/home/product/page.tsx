'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ProductPage = dynamic(() => import('@/features/home/module/product'), {
  loading: () => <Loading />,
});

const page = async () => {
  return <ProductPage />;
};

export default page;
