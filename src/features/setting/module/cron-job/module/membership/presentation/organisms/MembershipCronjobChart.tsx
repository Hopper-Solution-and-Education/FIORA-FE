import ComposedChartComponent from '@/components/common/charts/composed-chart';
import { COLORS } from '@/shared/constants/chart';
import { useMembershipCronjobDashboard } from '../hooks/useMembershipCronjobDashboard';

const MembershipCronjobChart = () => {
  const { chartData, chartLoading } = useMembershipCronjobDashboard();

  const data = chartData.map((item) => ({
    name: item.tierName,
    count: Number(item.count),
  }));

  return (
    <ComposedChartComponent
      data={data}
      columns={[{ key: 'count', name: 'Count', color: COLORS.DEPS_SUCCESS.LEVEL_1 }]}
      height={400}
      showLegend={true}
      isLoading={chartLoading}
      yAxisFormatter={(value) => value.toString()}
      currency=""
    />
  );
};

export default MembershipCronjobChart;
