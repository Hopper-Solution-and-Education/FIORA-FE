'use client';
import growthbook from '@/config/growthbook';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Dynamic import cho ProductCreationPage
const ProductCreationPage = dynamic(
  () => import('@/features/setting/module/product').then((mod) => mod.ProductCreationPage),
  { ssr: false },
);

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const isProductFeatureEnabled = growthbook.isOn(FeatureFlags.PRODUCT_FEATURE);

  useEffect(() => {
    if (!isProductFeatureEnabled) {
      toast.error('Product feature is not enabled');
      router.push('/'); // Dùng router.push thay vì redirect
    }
  }, [isProductFeatureEnabled, router]);

  useEffect(() => {
    if (!productId) {
      router.push('/setting/product');
    }
  }, [productId, router]);

  return <ProductCreationPage productId={productId} />;
}
