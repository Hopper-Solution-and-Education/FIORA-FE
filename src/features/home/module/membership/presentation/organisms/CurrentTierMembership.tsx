'use client';

import { useAppSelector } from '@/store';
import Image from 'next/image';
import { useMemo } from 'react';
import { mapTierBenefits } from '../../utils';
import { TierRank, TierRankData } from '../molecules';
import CurrentTierMembershipSkeleton from './CurrentTierMembershipSkeleton';

interface CurrentTierMembershipProps {
  label: string;
  loading?: boolean;
  nextTierRanks?: TierRankData[];
}

const CurrentTierMembership = ({
  label,
  loading = false,
  nextTierRanks,
}: CurrentTierMembershipProps) => {
  const selectedTier = useAppSelector((state) => state.membership.selectedTier);
  const currentTierInfo = useAppSelector((state) => state.user.userTier.data);

  const currentTierBenefits = useMemo(
    () =>
      mapTierBenefits(selectedTier?.tierBenefits || []).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
    [selectedTier],
  );

  const currentTierIcon = selectedTier?.mainIconUrl;
  const currentTierInactiveIcon = selectedTier?.inactiveIconUrl;

  // Only show main icon if both spent and balance meet/exceed the tier's minimum thresholds
  const showMainIcon = useMemo(() => {
    if (!selectedTier || !currentTierInfo) return false;
    const meetsSpent = currentTierInfo.currentSpent >= selectedTier.spentMinThreshold;
    const meetsBalance = currentTierInfo.currentBalance >= selectedTier.balanceMinThreshold;
    return meetsSpent && meetsBalance;
  }, [selectedTier, currentTierInfo]);

  if (loading) {
    return <CurrentTierMembershipSkeleton />;
  }

  const story = selectedTier?.story;

  return (
    <div className="flex flex-col h-full col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 shadow rounded-lg dark:border dark:border-gray-700">
      {/* Settings Panel */}
      <div className="p-4 flex-1">
        <div className="flex justify-start items-start gap-4">
          <h2
            className="sm:text-sm md:text-lg lg:text-xl font-bold mb-3 w-full
          "
          >
            {label}
          </h2>
        </div>

        {/* giảm khoảng cách giữa icon và Story */}
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 flex justify-center items-center">
            <Image
              src={
                (showMainIcon ? currentTierIcon : currentTierInactiveIcon) ||
                'https://picsum.photos/700'
              }
              alt="tier-rank"
              width={1920}
              height={1080}
              className="w-full h-[250px] object-contain rounded-lg"
            />
          </div>

          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
            <div className="bg-gray-100 dark:bg-gray-800 shadow p-4 mt-auto flex-1 flex flex-col overflow-auto h-full">
              <h2 className="text-xl font-bold mb-4">Story</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex-1">{story}</div>
            </div>
          </div>
        </div>
      </div>

      <TierRank data={currentTierBenefits} nextTierRanks={nextTierRanks} />
    </div>
  );
};

export default CurrentTierMembership;
