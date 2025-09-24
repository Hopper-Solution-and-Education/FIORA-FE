import ComposedChartComponent from '@/components/common/charts/composed-chart';
import { COLORS } from '@/shared/constants/chart';
import { useEffect, useState } from 'react';
import { membershipCronjobContainer } from '../../di/membershipCronjobDashboardDI';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IGetMembershipChartDataUseCase } from '../../domain/usecase/GetMembershipChartDataUseCase';

const MembershipCronjobChart = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      try {
        const useCase = membershipCronjobContainer.get<IGetMembershipChartDataUseCase>(
          MEMBERSHIP_CRONJOB_TYPES.IGetMembershipChartDataUseCase,
        );
        const res = await useCase.execute(undefined);
        const items = res.data?.items || [];
        setData(items.map((it) => ({ name: it.tierName, count: Number(it.count) })));
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, []);

  return (
    <ComposedChartComponent
      data={data}
      columns={[{ key: 'count', name: 'Count', color: COLORS.DEPS_SUCCESS.LEVEL_1 }]}
      height={400}
      showLegend={true}
      isLoading={loading}
      yAxisFormatter={(value) => value.toString()}
      currency=""
    />
  );
};

export default MembershipCronjobChart;
