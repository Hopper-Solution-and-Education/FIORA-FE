import VerticalPositiveNegativeBarChart from '@/components/common/charts/vertical-positive-negative-bar-chart';
import { COLORS } from '@/shared/constants';
import { VerticalBarDataItem } from './types';

export const VerticalPositiveNegativeBarChartExample = () => {
  const data: VerticalBarDataItem[] = [
    { name: 'Page A', income: 2000, expense: -3000 },
    { name: 'Page B', income: 1500, expense: -2500 },
    { name: 'Page B', income: 1500, expense: -2500 },
    { name: 'Page B', income: 1500, expense: -2500 },
    { name: 'Page B', income: 1500, expense: -2500 },
  ];

  return (
    <VerticalPositiveNegativeBarChart
      data={data}
      title="Vertical Positive Negative Bar Chart"
      currency="VND"
      columns={[
        { key: 'income', name: 'Thu nhập', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        { key: 'expense', name: 'Chi tiêu', color: COLORS.DEPS_DANGER.LEVEL_1 },
      ]}
    />
  );
};
