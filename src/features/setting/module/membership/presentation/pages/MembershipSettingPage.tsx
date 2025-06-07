'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  IconUploadItem,
  IconUploadList,
  MembershipRankChart,
  SettingTierAndStory,
} from '../molecules';

const MembershipSettingPage = () => {
  const [iconItems, setIconItems] = useState<IconUploadItem[]>([
    {
      id: 'inactiveIcon',
      name: 'Inactive Icon',
      placeholder: 'Choose Inactive Icon',
      value: null,
    },
    {
      id: 'passedIcon',
      name: 'Passed Icon',
      placeholder: 'Choose Passed Icon',
      value: null,
    },
    {
      id: 'themeIcon',
      name: 'Theme Icon',
      placeholder: 'Choose Theme Icon',
      value: null,
    },
  ]);

  return (
    <div className="min-h-screen p-6 ">
      {/* Main container with two rows */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Left Section: Balance Graph col-3 */}
        <MembershipRankChart />

        {/* Right Section: Settings and Story col-2 */}
        <SettingTierAndStory />
      </div>

      {/* Bottom Row: Icon Upload List */}
      <div className="mt-6">
        <IconUploadList items={iconItems} onChange={setIconItems} />
      </div>

      {/* Footer Button */}
      <div className="mt-6 flex justify-end">
        <Button className="flex items-center">
          <span className="mr-2">✔</span> Confirm
        </Button>
      </div>
    </div>
  );
};

export default MembershipSettingPage;
