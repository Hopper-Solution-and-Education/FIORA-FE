import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const BudgetDetailRender = dynamic(
  () => import('@/features/home/module/budgets/summary-detail/presentation/pages/BudgetDetail'),
  {
    loading: () => <Loading />,
  },
);

interface BudgetDetailPageProps {
  params: Promise<{ year: string }>;
}

export default async function BudgetDetailPage({ params }: BudgetDetailPageProps) {
  const { year } = await params;

  const isValidYear = year.length === 4 && !isNaN(Number(year));

  if (!isValidYear) {
    notFound();
  }

  return <BudgetDetailRender year={parseInt(year)} />;
}
