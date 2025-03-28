'use client';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';

const ProductPage = dynamic(() => import('@/features/setting/module/product'), {
  loading: () => <Loading />,
});

const Product = () => {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.PRODUCT_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <ProductPage />;
};

export default Product;
