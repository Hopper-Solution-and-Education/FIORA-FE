'use client';

import { ChartSkeleton } from '@/components/common/organisms';
import PositiveAndNegativeBarChartV2 from '@/components/common/positive-negative-bar-chart-v2';
import { TwoSideBarItem } from '@/components/common/positive-negative-bar-chart-v2/types';
import { mapPartnersToTwoSideBarItems } from '@/features/setting/module/partner/presentation/utils';
import { fetchPartners } from '@/features/setting/module/partner/slices/actions/fetchPartnersAsyncThunk';
import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { TabActionHeader } from '../components/TabActionHeader';

const PartnerSettingPage = () => {
  const dispatch = useAppDispatch();
  const { partners, isLoading } = useAppSelector((state) => state.partner);
  const { currency } = useAppSelector((state) => state.settings);
  const router = useRouter();

  useEffect(() => {
    // Always fetch partners when component mounts to ensure fresh data
    dispatch(fetchPartners({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  const barData = useMemo(
    () => mapPartnersToTwoSideBarItems(partners, currency),
    [partners, currency],
  );

  const handleNavigateToUpdate = (item: TwoSideBarItem) => {
    if (item.name === levelConfig.totalName || !item.id) {
      return;
    }

    router.push(`/setting/partner/update/${item.id}`);
  };

  type Depth = 0 | 1 | 2;

  const levelConfig: {
    totalName: string;
    colorPositive: Record<Depth, string>;
    colorNegative: Record<Depth, string>;
  } = {
    totalName: 'Total',
    colorPositive: {
      0: COLORS.DEPS_SUCCESS.LEVEL_1,
      1: COLORS.DEPS_SUCCESS.LEVEL_3,
      2: COLORS.DEPS_SUCCESS.LEVEL_5,
    },
    colorNegative: {
      0: COLORS.DEPS_DANGER.LEVEL_1,
      1: COLORS.DEPS_DANGER.LEVEL_3,
      2: COLORS.DEPS_DANGER.LEVEL_5,
    },
  };

  return (
    <div className="space-y-6">
      <TabActionHeader buttonLabel="" redirectPath="/setting/partner/create" />
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <PositiveAndNegativeBarChartV2
          data={barData}
          title="Partner Transactions"
          levelConfig={levelConfig}
          legendItems={[
            { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
            { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
          ]}
          showTotal
          totalName="Total"
          callback={handleNavigateToUpdate}
          xAxisFormatter={(value) => formatCurrency(value, currency)}
          currency={currency}
        />
      )}
    </div>
  );
};

export default PartnerSettingPage;
