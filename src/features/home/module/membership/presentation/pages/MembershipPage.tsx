'use client';

import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { getListMembershipAsyncThunk } from '../../slices/actions';
import { CurrentTierMembership, MembershipRankChart } from '../organisms';

const MembershipPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
  }, []);
  return (
    <div className="min-h-screen p-6 ">
      {/* Main container with two rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Section: Balance Graph col-3 */}
        <MembershipRankChart />

        {/* Right Section: Settings and Story col-2 */}
        <CurrentTierMembership />
      </div>

      {/* Bottom Row: Icon Upload List */}
      <div className="mt-6"></div>
    </div>
  );
};

export default MembershipPage;
