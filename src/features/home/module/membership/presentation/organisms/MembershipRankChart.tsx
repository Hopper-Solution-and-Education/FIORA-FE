import ScatterRankingChart from '@/components/common/charts/scatter-rank-chart';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { COLORS } from '@/shared/constants/chart';
import { useAppSelector } from '@/store';
import { useMemo, useState } from 'react';
import { Membership } from '../../domain/entities';
import {
  createCombinedTierIcons,
  mapTierBenefits,
  transformToBalanceTiers,
  transformToSpentTiers,
} from '../../utils';
import CurrentTierMembership from './CurrentTierMembership';

const MembershipRankChart = () => {
  const memberships = useAppSelector((state) => state.membership.memberships);
  const isLoadingGetMemberships = useAppSelector(
    (state) => state.membership.isLoadingGetMemberships,
  );

  const currentUserTier = useAppSelector((state) => state.user.userTier);


  const [showCurrentTier, setShowCurrentTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Membership | null>(null);
  const handleShowCurrentTier = (tier: Membership) => {
    setSelectedTier(tier);
    setShowCurrentTier(true);
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
    return createCombinedTierIcons(
      balanceTiers,
      spentTiers,
      memberships,
      (bTier, sTier, item) => handleShowCurrentTier(item as Membership),
      currentUserTier?.data?.currentBalance ?? 0,
      currentUserTier?.data?.currentSpent ?? 0,
    );
  }, [balanceTiers, spentTiers, memberships]);

  return (
    <div className="shadow col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 rounded-lg p-2 dark:border dark:border-gray-700">
      <Dialog open={showCurrentTier} onOpenChange={setShowCurrentTier} modal>
        <DialogContent className="sm:max-w-[725px]">
          <DialogTitle className="sr-only">Tier Information</DialogTitle>
          <CurrentTierMembership
            label={selectedTier?.tierName ?? ''}
            icon={selectedTier?.mainIconUrl}
            tierRanks={mapTierBenefits(selectedTier?.tierBenefits ?? [])}
            loading={isLoadingGetMemberships}
          />
        </DialogContent>
      </Dialog>
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
      />
    </div>
  );
};

export default MembershipRankChart;
