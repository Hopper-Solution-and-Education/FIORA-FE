'use client';
import Loading from '@/components/common/atoms/Loading';
import ProductCreation from '@/features/setting/module/product/presentation/pages/ProductCreation';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

export default function Page() {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.PRODUCT_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <ProductCreation />;
}
