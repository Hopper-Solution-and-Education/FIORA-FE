'use client';

import PositiveNegativeStackBarChart from '@/components/common/positive-negative-stack-bar-chart';
import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';

interface BudgetChartProps {
  data: any[];
  title: string;
  currency: string;
}

const BudgetChart = ({ data, title, currency }: BudgetChartProps) => {
  return (
    <PositiveNegativeStackBarChart
      data={data}
      title={title}
      currency={currency || 'USD'}
      xAxisFormatter={(value) => formatCurrency(value, currency || 'USD')}
      legendItems={[
        { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
        { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        { name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_1 },
      ]}
    />
  );
};

export default BudgetChart;
