import dynamic from 'next/dynamic';

type TransactionDetailProps = { params: Promise<{ slug: string }> };

const TransactionDetails = dynamic(
  () => import('@/features/home/module/transaction/[id]/TransactionDetailsPage'),
  {
    ssr: true,
  },
);

export default async function Page({ params }: TransactionDetailProps) {
  const { slug } = await params;

  return <TransactionDetails id={slug} />;
}
