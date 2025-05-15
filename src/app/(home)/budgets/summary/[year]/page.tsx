import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';
import React from 'react';
import { notFound } from 'next/navigation';

const BudgetSumaryRender = dynamic(
  () => import('@/features/home/module/budgets/summary/presentation/pages/BudgetSumary'),
  {
    loading: () => <Loading />,
  },
);

interface BudgetSummaryPageProps {
  params: Promise<{ year: string }>;
}

export default async function BudgetSummaryPage({ params }: BudgetSummaryPageProps) {
  const { year } = await params;

  const isValidYear = year.length === 4 && !isNaN(Number(year));

  if (!isValidYear) {
    notFound();
  }

  return <BudgetSumaryRender year={parseInt(year)} />;
}
