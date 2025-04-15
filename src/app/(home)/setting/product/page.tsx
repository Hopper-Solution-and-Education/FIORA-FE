'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ProductPage = dynamic(() => import('@/features/setting/module/product'), {
  loading: () => <Loading />,
  ssr: false,
});

const Product = () => {
  return <ProductPage />;
};

export default Product;
