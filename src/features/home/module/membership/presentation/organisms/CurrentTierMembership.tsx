'use client';

import Image from 'next/image';
import { TierRank, TierRankData } from '../molecules';
import CurrentTierMembershipSkeleton from './CurrentTierMembershipSkeleton';
import React from 'react';

interface CurrentTierMembershipProps {
  label: string;
  icon?: string;
  tierRanks: TierRankData[];
  nextTierRanks?: TierRankData[];
  showStory?: boolean;
  loading?: boolean;
  story?: string;
}

const CurrentTierMembership = ({
  label,
  icon,
  tierRanks,
  nextTierRanks,
  showStory = false,
  loading = false,
  story,
}: CurrentTierMembershipProps) => {
  // Show skeleton when loading
  if (loading) {
    return <CurrentTierMembershipSkeleton showStory={showStory} />;
  }

  return (
    <div className="flex flex-col h-full space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 shadow rounded-lg dark:border dark:border-gray-700">
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

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 flex justify-center items-center">
            <Image
              src={icon || 'https://picsum.photos/700'}
              alt="tier-rank"
              width={1920}
              height={1080}
              className="w-full max-h-[200px] object-contain rounded-lg"
            />
          </div>

          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
            <TierRank data={tierRanks} nextTierRanks={nextTierRanks} />
          </div>
        </div>
      </div>

      {showStory && (
        <div className="bg-gray-100 dark:bg-gray-800 shadow p-4 min-h-[300px] mt-auto flex flex-col">
          <h2 className="text-xl font-bold mb-4">Story</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex-1">{story}</div>
        </div>
      )}
    </div>
  );
};

export default CurrentTierMembership;
