import ScatterRankingChart from '@/components/common/charts/scatter-rank-chart';
import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setSelectedMembership } from '../../slices';
import DialogEditThresholdBenefitTier from '../organisms/DialogEditThresholdBenefitTier';
import { createCombinedTierIcons, transformToBalanceTiers, transformToSpentTiers } from '../utils';

const MembershipRankChart = () => {
  const memberships = useAppSelector((state) => state.memberShipSettings.memberships);
  const isLoadingGetMemberships = useAppSelector(
    (state) => state.memberShipSettings.isLoadingGetMemberships,
  );
  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);
  const [isShowDialogEditThresholdBenefitTier, setIsShowDialogEditThresholdBenefitTier] =
    useState(false);
  const dispatch = useAppDispatch();
  const [axis, setAxis] = useState<'balance' | 'spent'>('balance');

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

  const handleClickYAxisRange = (tier: Tier, index: number) => {
    setIsShowDialogEditThresholdBenefitTier(true);
    setAxis('balance');
  };

  const handleClickXAxisRange = (tier: Tier, index: number) => {
    setIsShowDialogEditThresholdBenefitTier(true);
    setAxis('spent');
  };

  return (
    <div className="shadow col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7 rounded-lg">
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
        isLoading={isLoadingGetMemberships}
        currentId={selectedMembership?.id}
        onClickXAxisRange={handleClickXAxisRange}
        onClickYAxisRange={handleClickYAxisRange}
      />
      <DialogEditThresholdBenefitTier
        open={isShowDialogEditThresholdBenefitTier}
        onOpenChange={setIsShowDialogEditThresholdBenefitTier}
        axis={axis}
      />
    </div>
  );
};

export default MembershipRankChart;
