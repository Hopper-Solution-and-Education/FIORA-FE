import ScatterRankingChart from '@/components/common/charts/scatter-rank-chart';
import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { COLORS } from '@/shared/constants/chart';
import { useAppSelector } from '@/store';
import { useMemo, useState } from 'react';
import { createCombinedTierIcons, transformToBalanceTiers, transformToSpentTiers } from '../utils';

const MembershipRankChart = () => {
  const { memberships } = useAppSelector((state) => state.memberShipSettings);
  const [selectedItem, setSelectedItem] = useState<{ balance: number; spent: number } | null>({
    balance: 0,
    spent: 0,
  });

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
    const handleTierClick = (balanceTier: Tier, spentTier: Tier) => {
      setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
    };

    return createCombinedTierIcons(balanceTiers, spentTiers, memberships, handleTierClick);
  }, [balanceTiers, spentTiers, memberships]);

  return (
    <div className="shadow col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 rounded-lg">
      <ScatterRankingChart
        currentTier={selectedItem || { balance: 0, spent: 0 }}
        balanceTiers={balanceTiers}
        spentTiers={spentTiers}
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
      />
    </div>
  );
};

export default MembershipRankChart;
