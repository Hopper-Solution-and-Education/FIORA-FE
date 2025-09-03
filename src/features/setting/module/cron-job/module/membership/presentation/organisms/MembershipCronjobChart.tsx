import ComposedChartComponent from '@/components/common/charts/composed-chart';
import { COLORS } from '@/shared/constants/chart';
import { useAppSelector } from '@/store';

const MembershipCronjobChart = () => {
  const { statistics } = useAppSelector((s) => s.membershipCronjob);

  const successful = statistics?.statusCounts?.successful || 0;
  const fail = statistics?.statusCounts?.fail || 0;

  const data = [{ name: 'Status', successful, fail }];

  return (
    <ComposedChartComponent
      data={data}
      title="Membership Jobs Overview"
      columns={[
        { key: 'successful', name: 'Successful', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        { key: 'fail', name: 'Failed', color: COLORS.DEPS_DANGER.LEVEL_1 },
      ]}
      height={280}
      showLegend={true}
    />
  );
};

export default MembershipCronjobChart;
