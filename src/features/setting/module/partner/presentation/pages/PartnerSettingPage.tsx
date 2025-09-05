'use client';

import PositiveAndNegativeBarChartV2 from '@/components/common/charts/positive-negative-bar-chart-v2';
import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { ChartSkeleton } from '@/components/common/organisms';
import { mapPartnersToTwoSideBarItems } from '@/features/setting/module/partner/presentation/utils';
import { fetchPartners } from '@/features/setting/module/partner/slices/actions/fetchPartnersAsyncThunk';
import { COLORS } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { TabActionHeader } from '../components/TabActionHeader';

const PartnerSettingPage = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { partners, isLoading } = useAppSelector((state) => state.partner);
  const { currency } = useAppSelector((state) => state.settings);
  const router = useRouter();
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        fetchPartners({
          page: 1,
          pageSize: 100,
          userId: session.user.id,
          filters: {},
        }),
      );
    }
  }, [dispatch, session?.user?.id]);

  const barData = useMemo(() => {
    // Ensure partners is an array before processing
    const partnersArray = Array.isArray(partners) ? partners : [];
    return mapPartnersToTwoSideBarItems(partnersArray, currency, getExchangeAmount);
  }, [partners, currency]);

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
      <TabActionHeader buttonLabel="Create New Partner" redirectPath="/setting/partner/create" />
      {isLoading ? (
        <ChartSkeleton />
      ) : !partners || !Array.isArray(partners) || partners.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] my-16 text-center">
          <p className="text-lg font-medium text-gray-500">No partners found.</p>
          <p className="text-sm text-gray-400">Please create a new partner to get started.</p>
        </div>
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
