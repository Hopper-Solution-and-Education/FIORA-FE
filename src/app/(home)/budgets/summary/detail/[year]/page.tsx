import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

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
  /* eslint-disable react-hooks/rules-of-hooks */
  const router = useRouter();

  const isValidYear = year.length === 4 && !isNaN(Number(year));

  if (!isValidYear) {
    router.push('/not-found');
  }

  return <BudgetDetailRender year={parseInt(year)} />;
}
