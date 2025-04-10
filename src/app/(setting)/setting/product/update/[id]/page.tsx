'use client';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// Dynamic import cho ProductCreationPage
const ProductCreationPage = dynamic(
  () => import('@/features/setting/module/product').then((mod) => mod.ProductCreationPage),
  { ssr: false },
);

export default function Page() {
  const params = useParams();
  const productId = params?.id as string;
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.PRODUCT_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <ProductCreationPage productId={productId} />;
}
