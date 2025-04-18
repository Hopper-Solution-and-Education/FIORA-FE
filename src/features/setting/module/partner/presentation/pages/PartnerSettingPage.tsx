'use client';

import { fetchPartners } from '@/features/setting/module/partner/slices/actions/fetchPartnersAsyncThunk';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { TabActionHeader } from '../components/TabActionHeader';
import { mapPartnersToTwoSideBarItems } from '@/features/setting/module/partner/presentation/utils';
import { ChartSkeleton } from '@/components/common/organisms';
import PositiveAndNegativeBarChartV2 from '@/components/common/positive-negative-bar-chart-v2';
import { TwoSideBarItem } from '@/components/common/positive-negative-bar-chart-v2/types';

const PartnerSettingPage = () => {
  const dispatch = useAppDispatch();
  const { partners, isLoading } = useAppSelector((state) => state.partner);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && !partners.length) {
      dispatch(fetchPartners({ userId: session.user.id, page: 1, pageSize: 100 }));
    } else if (status === 'unauthenticated') {
      toast.error('User not authenticated. Please log in.');
    }
  }, [dispatch, status, session?.user?.id, partners.length]);

  const barData = useMemo(() => mapPartnersToTwoSideBarItems(partners), [partners]);

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
        />
      )}
    </div>
  );
};

export default PartnerSettingPage;
