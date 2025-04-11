'use client';
import growthbook from '@/config/growthbook';
import ProductCreation from '@/features/setting/module/product/presentation/pages/ProductCreation';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const isProductFeatureEnabled = growthbook.isOn(FeatureFlags.PRODUCT_FEATURE);

  useEffect(() => {
    if (!isProductFeatureEnabled) {
      toast.error('Product feature is not enabled', {
        description: '',
      });
      redirect('/');
    }
  }, [isProductFeatureEnabled]);
  return <ProductCreation />;
}
