import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const BudgetSumaryRender = dynamic(
  () => import('@/features/home/module/budgets/summary-detail/presentation/pages/BudgetSumary'),
  {
    loading: () => <Loading />,
  },
);

interface BudgetSummaryPageProps {
  params: Promise<{ year: string }>;
}

export default async function BudgetSummaryPage({ params }: BudgetSummaryPageProps) {
  const { year } = await params;
  /* eslint-disable react-hooks/rules-of-hooks */
  const router = useRouter();

  const isValidYear = year.length === 4 && !isNaN(Number(year));

  if (!isValidYear) {
    router.push('/not-found');
  }

  return <BudgetSumaryRender year={parseInt(year)} />;
}
