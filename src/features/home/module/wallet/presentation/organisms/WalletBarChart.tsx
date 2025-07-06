'use client';

import React, { useMemo } from 'react';
import PositiveAndNegativeBarChartV2 from '@/components/common/charts/positive-negative-bar-chart-v2';
import { COLORS } from '@/shared/constants/chart';
import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import { transformWalletsToChartData } from '../../utils';
import { useAppSelector } from '@/store';
import { filterWallets } from '../../utils';
import ChartSkeleton from '@/components/common/organisms/ChartSkeleton';
import { Icons } from '@/components/Icon';

const WalletBarChart = () => {
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const loading = useAppSelector((state) => state.wallet.loading);
  const filterCriteria = useAppSelector((state) => state.wallet.filterCriteria);
  const { filters, search } = filterCriteria;

  const filteredWallets = useMemo(() => {
    return filterWallets(wallets || [], filters, search);
  }, [wallets, filters, search]);

  const chartData: TwoSideBarItem[] = useMemo(
    () => transformWalletsToChartData(filteredWallets),
    [filteredWallets],
  );

  if (loading) {
    return <ChartSkeleton />;
  }

  if (!loading && (!wallets || wallets.length === 0)) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full pb-10">
        <div className="w-full opacity-80 border border-dashed border-muted-foreground/30 rounded-xl p-8 shadow-sm h-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-8 max-w-xs mx-auto">
            <Icons.wallet className="w-12 h-12 text-muted-foreground mb-3" />

            <div className="text-lg font-semibold text-muted-foreground mb-1">No wallets found</div>
            <div className="text-sm text-muted-foreground mb-3 text-center">
              Please create a wallet to view your chart.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PositiveAndNegativeBarChartV2
      data={chartData}
      title=" "
      showTotal={false}
      currency="FX"
      labelFormatter={(value) => formatFIORACurrency(value, 'FX')}
      legendItems={[
        { name: 'Positive', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        { name: 'Negative', color: COLORS.DEPS_DANGER.LEVEL_1 },
      ]}
      height={500}
      baseBarHeight={80}
      tooltipContent={({ payload }) => {
        if (!payload || !payload.length) return null;
        const item = payload[0].payload;
        const amount = item.positiveValue !== 0 ? item.positiveValue : item.negativeValue;
        const isPositive = amount > 0;

        return (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-3 rounded-md">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Amount:{' '}
              <span
                className="font-bold"
                style={{
                  color: isPositive ? COLORS.DEPS_SUCCESS.LEVEL_1 : COLORS.DEPS_DANGER.LEVEL_1,
                }}
              >
                {formatFIORACurrency(amount, 'FX')}
              </span>
            </p>
          </div>
        );
      }}
    />
  );
};

export default WalletBarChart;
