'use client';

import PositiveNegativeStackBarChart from '@/components/common/charts/positive-negative-stack-bar-chart';
import { CURRENCY } from '@/shared/constants';
import { COLORS } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';

interface BudgetChartProps {
  data: any[];
  title: string;
  currency: string;
}

const BudgetChart = ({ data, title, currency }: BudgetChartProps) => {
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <PositiveNegativeStackBarChart
      data={data}
      title={title}
      currency={currency || 'USD'}
      xAxisFormatter={(value) => formatCurrency(value, currency || CURRENCY.USD)}
      legendItems={[
        { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
        { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        { name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_1 },
      ]}
    />
  );
};

export default BudgetChart;
