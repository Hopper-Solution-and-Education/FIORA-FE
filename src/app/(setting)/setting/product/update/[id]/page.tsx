import ProductCreation from '@/features/setting/module/product/presentation/pages/ProductCreation';

export const metadata = {
  title: 'Dashboard : Product View',
};

type PageProps = { params: { id: string } };

export default async function Page({ params }: PageProps) {
  const { id } = params;

  return <ProductCreation productId={id} />;
}
