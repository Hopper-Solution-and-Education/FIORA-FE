'use client';
import Loading from '@/components/common/atoms/Loading';
import growthbook from '@/config/growthbook';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ProductPage = dynamic(() => import('@/features/setting/module/product'), {
  loading: () => <Loading />,
  ssr: false,
});

const Page = () => {
  const isProductFeatureEnabled = growthbook.isOn(FeatureFlags.PRODUCT_FEATURE);

  useEffect(() => {
    if (!isProductFeatureEnabled) {
      toast.error('Product feature is not enabled', {
        description: '',
      });
      redirect('/home');
    }
  }, [isProductFeatureEnabled]);

  return <ProductPage />;
};

export default Page;
