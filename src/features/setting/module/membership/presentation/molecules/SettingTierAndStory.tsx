'use client';

import SettingTierInputFieldConfig from '../config/SettingTierInputFieldConfig';
import StoryTierInputFieldConfig from '../config/StoryTierInputFieldConfig';

const SettingTierAndStory = () => {
  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 shadow rounded-lg">
      {/* Settings Panel */}
      <div className="p-4 ">
        <h2 className="text-xl font-bold mb-3">Setting Tier: Platinum Qili</h2>
        <div className="max-w-2xl">
          <SettingTierInputFieldConfig />
        </div>
      </div>

      {/* Story Section */}
      <div className="p-4 rounded-lg shadow h-60">
        <h2 className="text-xl font-bold mb-4">Story</h2>
        <StoryTierInputFieldConfig />
      </div>
    </div>
  );
};

export default SettingTierAndStory;
