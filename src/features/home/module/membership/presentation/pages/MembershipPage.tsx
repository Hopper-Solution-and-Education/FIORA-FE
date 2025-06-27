'use client';

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/store';
import { getCurrentTierAsyncThunk } from '@/store/actions';
import { useEffect } from 'react';
import { getListMembershipAsyncThunk } from '../../slices/actions';
import { mapTierBenefits } from '../../utils';
import { CurrentTierMembership, MembershipRankChart } from '../organisms';

const MembershipPage = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const isLoadingGetListMembership = useAppSelector(
    (state) => state.membership.isLoadingGetMemberships,
  );

  const { data: userTier, isLoading: isLoadingUserTier } = useAppSelector(
    (state) => state.user.userTier,
  );

  useEffect(() => {
    if (!isLoadingGetListMembership) {
      dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
    }

    dispatch(getCurrentTierAsyncThunk());
  }, []);

  const currentTierName = userTier?.currentTier?.tierName;
  const nextSpendingTierName = userTier?.nextSpendingTier?.tierName;
  const nextBalanceTierName = userTier?.nextBalanceTier?.tierName;

  const currentTierIcon = userTier?.currentTier?.mainIconUrl;
  const nextSpendingTierIcon = userTier?.nextSpendingTier?.mainIconUrl;
  const nextBalanceTierIcon = userTier?.nextBalanceTier?.mainIconUrl;

  const currentTierBenefits = mapTierBenefits(userTier?.currentTier?.tierBenefits || []);
  const nextSpendingTierBenefits = mapTierBenefits(userTier?.nextSpendingTier?.tierBenefits || []);
  const nextBalanceTierBenefits = mapTierBenefits(userTier?.nextBalanceTier?.tierBenefits || []);

  return (
    <div className="min-h-screen p-6 ">
      {/* Main container with two rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Section: Balance Graph col-3 */}
        {!isMobile && <MembershipRankChart />}

        {/* Right Section: Settings and Story col-2 */}
        <CurrentTierMembership
          label={`Your Tier: ${currentTierName}`}
          icon={currentTierIcon}
          tierRanks={currentTierBenefits}
          showStory={true}
          loading={isLoadingUserTier}
          story={userTier?.currentTier?.story}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
          <CurrentTierMembership
            label={`Next Spending Tier: ${nextSpendingTierName}`}
            icon={nextSpendingTierIcon}
            tierRanks={nextSpendingTierBenefits}
            loading={isLoadingUserTier}
          />
        </div>
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
          <CurrentTierMembership
            label={`Next Balance Tier: ${nextBalanceTierName}`}
            icon={nextBalanceTierIcon}
            tierRanks={nextBalanceTierBenefits}
            loading={isLoadingUserTier}
          />
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
