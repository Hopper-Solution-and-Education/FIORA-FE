import dynamic from 'next/dynamic';

type TransactionDetailProps = { params: Promise<{ id: string }> };

const TransactionDetails = dynamic(
  () => import('@/features/home/module/transaction/[id]/TransactionDetailsPage'),
  {
    ssr: true,
  },
);

export default async function Page({ params }: TransactionDetailProps) {
  const { id } = await params;

  return <TransactionDetails id={id} />;
}
