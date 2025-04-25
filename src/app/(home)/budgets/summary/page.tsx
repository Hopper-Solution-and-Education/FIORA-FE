import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';
import React from 'react';

const BudgetSumaryRender = dynamic(
  () => import('@/features/home/module/budgets/summary/presentation/pages/BudgetSumary'),
  {
    loading: () => <Loading />,
  },
);

const BudgetSummaryPage = () => {
  return <BudgetSumaryRender />;
};

export default BudgetSummaryPage;
