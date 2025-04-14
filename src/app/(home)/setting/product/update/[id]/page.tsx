'use client';
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

  return <ProductCreationPage productId={productId} />;
}
