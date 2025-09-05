'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { getCurrentTierAsyncThunk } from '@/store/actions';
import { useEffect } from 'react';
import { setSelectedTier } from '../../slices';
import { getListMembershipAsyncThunk } from '../../slices/actions';
import { CurrentTierMembership, MembershipRankChart } from '../organisms';

const MembershipPage = () => {
  const dispatch = useAppDispatch();
  const isLoadingGetListMembership = useAppSelector(
    (state) => state.membership.isLoadingGetMemberships,
  );
  const selectedTier = useAppSelector((state) => state.membership.selectedTier);
  const { data: userTier, isLoading: isLoadingUserTier } = useAppSelector(
    (state) => state.user.userTier,
  );

  useEffect(() => {
    if (!isLoadingGetListMembership) {
      dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
    }

    dispatch(getCurrentTierAsyncThunk());
  }, []);

  useEffect(() => {
    if (userTier?.currentTier) {
      dispatch(setSelectedTier(userTier?.currentTier));
    }
  }, [userTier?.currentTier]);

  const currentTierName = selectedTier?.tierName;

  return (
    <div className="min-h-screen px-4">
      {/* Main container with two rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-200px)] items-stretch">
        {/* Left Section: Balance Graph col-3 */}
        <MembershipRankChart />

        {/* Right Section: Settings and Story col-2 */}
        <CurrentTierMembership
          label={`Your Tier: ${currentTierName}`}
          loading={isLoadingUserTier}
        />
      </div>
    </div>
  );
};

export default MembershipPage;
