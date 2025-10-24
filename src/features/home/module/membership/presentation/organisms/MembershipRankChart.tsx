import ScatterRankingChart from '@/components/common/charts/scatter-rank-chart';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useMemo } from 'react';
import { Membership } from '../../domain/entities';
import { setSelectedTier } from '../../slices';
import {
  createCombinedTierIcons,
  transformToBalanceTiers,
  transformToSpentTiers,
} from '../../utils';

const MembershipRankChart = () => {
  const dispatch = useAppDispatch();
  const memberships = useAppSelector((state) => state.membership.memberships);
  const isLoadingGetMemberships = useAppSelector(
    (state) => state.membership.isLoadingGetMemberships,
  );

  const currentUserTier = useAppSelector((state) => state.user.userTier);

  const handleShowCurrentTier = (tier: Membership) => {
    dispatch(setSelectedTier(tier));
  };

  // Transform API data into balance tiers
  const balanceTiers = useMemo(() => {
    return transformToBalanceTiers(memberships);
  }, [memberships]);

  // Transform API data into spent tiers
  const spentTiers = useMemo(() => {
    return transformToSpentTiers(memberships);
  }, [memberships]);

  // Create combined tier icons mapping with onClick handlers
  const combinedTierIcons = useMemo(() => {
    if (!currentUserTier?.data) return {};

    return createCombinedTierIcons(
      balanceTiers,
      spentTiers,
      memberships,
      (bTier, sTier, item) => handleShowCurrentTier(item as Membership),
      currentUserTier.data.currentSpent ?? 0,
      currentUserTier,
      currentUserTier.data.currentBalance ?? 0
    );
  }, [balanceTiers, spentTiers, memberships, currentUserTier]);

  return (
    <div className="shadow col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7 rounded-lg p-2 dark:border dark:border-gray-700 min-h-[500px]">
      <ScatterRankingChart
        currentTier={{
          balance: currentUserTier?.data?.currentBalance ?? 0,
          spent: currentUserTier?.data?.currentSpent ?? 0,
        }}
        balanceTiers={balanceTiers}
        spentTiers={spentTiers}
        title=""
        xLegend={{
          items: [
            { name: 'Total Spent (FX)', color: COLORS.DEPS_INFO.LEVEL_5 },
            { name: 'Actual Spent (FX)', color: COLORS.DEPS_INFO.LEVEL_1 },
          ],
        }}
        yLegend={{
          items: [
            { name: 'Actual Balance (FX)', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
            { name: 'Total Balance (FX)', color: COLORS.DEPS_SUCCESS.LEVEL_5 },
          ],
        }}
        barColors={{
          xBg: COLORS.DEPS_INFO.LEVEL_5,
          x: COLORS.DEPS_INFO.LEVEL_1,
          yBg: COLORS.DEPS_SUCCESS.LEVEL_5,
          y: COLORS.DEPS_SUCCESS.LEVEL_1,
        }}
        combinedTierIcons={combinedTierIcons}
        isLoading={isLoadingGetMemberships}
        className="h-full"
      />
    </div>
  );
};

export default MembershipRankChart;
