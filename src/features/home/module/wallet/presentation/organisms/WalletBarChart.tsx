import React, { useMemo } from 'react';
import PositiveAndNegativeBarChartV2 from '@/components/common/charts/positive-negative-bar-chart-v2';
import { COLORS } from '@/shared/constants/chart';
import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { useInitializeUserWallet } from '../hooks';

const WalletBarChart = () => {
  const { wallets } = useInitializeUserWallet();

  const chartData: TwoSideBarItem[] = useMemo(
    () =>
      wallets.map((w) => ({
        id: w.id,
        name: w.name || w.type,
        positiveValue: w.frBalanceActive > 0 ? w.frBalanceActive : 0,
        negativeValue: w.frBalanceActive < 0 ? w.frBalanceActive : 0,
        icon: w.icon,
        type: w.type,
      })),
    [wallets],
  );

  return (
    <PositiveAndNegativeBarChartV2
      data={chartData}
      title=" "
      showTotal={true}
      totalName="Total"
      currency="FX"
      legendItems={[
        { name: 'Positive', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        { name: 'Negative', color: COLORS.DEPS_DANGER.LEVEL_1 },
      ]}
      height={400}
    />
  );
};

export default WalletBarChart;
