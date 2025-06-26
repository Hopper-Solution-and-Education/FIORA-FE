'use client';

import Image from 'next/image';
import { TierRank } from '../molecules';

const CurrentTierMembership = () => {
  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 shadow rounded-lg">
      {/* Settings Panel */}
      <div className="p-4 ">
        <div className="flex justify-start items-start gap-4">
          <h2
            className="sm:text-sm md:text-lg lg:text-xl font-bold mb-3 w-full
          "
          >
            Your Tier: Platinum Qili
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5">
            <Image
              src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg"
              alt="tier-rank"
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
            <TierRank />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Story</h2>
      </div>
    </div>
  );
};

export default CurrentTierMembership;
