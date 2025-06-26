import ScatterRankingChart from '@/components/common/charts/scatter-rank-chart';
import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setSelectedMembership } from '../../slices';
import {
  createCombinedTierIcons,
  transformToBalanceTiers,
  transformToSpentTiers,
} from '../../utils';

const MembershipRankChart = () => {
  const memberships = useAppSelector((state) => state.memberShipSettings.memberships);
  const isLoadingGetMemberships = useAppSelector(
    (state) => state.memberShipSettings.isLoadingGetMemberships,
  );
  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);

  const dispatch = useAppDispatch();

  const handleTierClick = useCallback(
    (balanceTier: Tier, spentTier: Tier, item?: any) => {
      setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      dispatch(setSelectedMembership(item));
    },
    [dispatch],
  );

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
    return createCombinedTierIcons(balanceTiers, spentTiers, memberships, handleTierClick);
  }, [balanceTiers, spentTiers, memberships]);

  const [selectedItem, setSelectedItem] = useState<{ balance: number; spent: number } | null>(
    selectedMembership
      ? {
          balance: selectedMembership.balanceMinThreshold,
          spent: selectedMembership.spentMinThreshold,
        }
      : null,
  );

  useEffect(() => {
    if (memberships.length > 0) {
      dispatch(setSelectedMembership(memberships[0]));
    }
  }, [memberships]);

  return (
    <div className="shadow col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 rounded-lg p-2">
      <ScatterRankingChart
        currentTier={selectedItem || { balance: 0, spent: 0 }}
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
        currentId={selectedMembership?.id}
      />
    </div>
  );
};

export default MembershipRankChart;
