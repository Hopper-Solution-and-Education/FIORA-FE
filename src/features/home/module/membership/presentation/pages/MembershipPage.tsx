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
        <CurrentTierMembership
          tier="Qili - Platinum"
          tierIcon="https://picsum.photos/200"
          tierRanks={data}
          showStory={true}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
          <CurrentTierMembership
            tier="Qili - Diamond"
            tierIcon="https://picsum.photos/200"
            tierRanks={data}
          />
        </div>
        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
          <CurrentTierMembership
            tier="Qili - Legend"
            tierIcon="https://picsum.photos/200"
            tierRanks={data}
          />
        </div>
      </div>
    </div>
  );
};

const data = [
  {
    label: 'Referral Bonus',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Referral Kickback',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Saving Interest',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Staking Interest',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Loan Interest',
    value: '100',
    suffix: '%',
  },
  {
    label: 'BNPL Fee',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Cashback',
    value: '100',
    suffix: '%',
  },
  {
    label: 'Investment Interest',
    value: '100',
    suffix: '%',
  },
];

export default MembershipPage;
