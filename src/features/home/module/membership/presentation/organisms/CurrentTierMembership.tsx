'use client';

import Image from 'next/image';
import { TierRank, TierRankData } from '../molecules';

interface CurrentTierMembershipProps {
  tier: string;
  tierIcon?: string;
  tierRanks: TierRankData[];
  showStory?: boolean;
}

const CurrentTierMembership = ({
  tier,
  tierIcon,
  tierRanks,
  showStory = false,
}: CurrentTierMembershipProps) => {
  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 shadow rounded-lg">
      {/* Settings Panel */}
      <div className="p-4 ">
        <div className="flex justify-start items-start gap-4">
          <h2
            className="sm:text-sm md:text-lg lg:text-xl font-bold mb-3 w-full
          "
          >
            Your Tier: {tier}
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 flex justify-center items-center">
            <Image
              src={tierIcon || 'https://picsum.photos/700'}
              alt="tier-rank"
              width={1280}
              height={720}
              className="w-full max-h-[200px] object-cover rounded-lg"
            />
          </div>

          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
            <TierRank data={tierRanks} />
          </div>
        </div>
      </div>

      {showStory && (
        <div className="rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Story</h2>
        </div>
      )}
    </div>
  );
};

export default CurrentTierMembership;
