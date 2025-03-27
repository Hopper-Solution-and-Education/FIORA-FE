'use client';
import ProductCreation from '@/features/setting/module/product/presentation/pages/ProductCreation';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id as string;

  useEffect(() => {
    if (!productId) {
      router.push('/setting/product');
    }
  }, [productId]);

  return <ProductCreation productId={productId} />;
}
