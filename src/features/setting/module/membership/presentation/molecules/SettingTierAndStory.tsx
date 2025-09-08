'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store';
import { SettingTierInputFieldConfig, StoryTierInputFieldConfig } from '../config';
import { DynamicFieldTier } from '../schema/editMemberShip.schema';
import IconUploadList from './IconUploadList';

// const renderEmptySubmitButton = () => {
//   return <></>;
// };

type SettingTierAndStoryProps = {
  dynamicTierFields: DynamicFieldTier[];
};

const SettingTierAndStory = ({ dynamicTierFields }: SettingTierAndStoryProps) => {
  const selectedTier = useAppSelector((state) => state.memberShipSettings.selectedMembership);
  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );

  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 shadow rounded-lg pt-4">
      {/* Settings Panel */}
      <div className="px-2">
        <div className="flex justify-between items-start gap-4 w-full">
          <h2 className="sm:text-sm md:text-md lg:text-md font-bold mb-3 w-1/2">
            Select Tier: <span>{selectedTier?.tierName}</span>
          </h2>

          {/* <div className="w-full"> */}
          {/* <FormConfig
              fields={[<InputField key="tier" name="tier" placeholder="Tier name" />]}
              methods={methods}
              renderSubmitButton={renderEmptySubmitButton}
            /> */}
          {/* </div> */}

          <Button
            variant="outline"
            form="edit-member-ship-form"
            type="submit"
            disabled={isLoadingUpsertMembership}
          >
            {isLoadingUpsertMembership ? (
              <Icons.spinner className="animate-spin h-5 w-5" />
            ) : (
              <Icons.save className="w-4 h-4" />
            )}
            Save
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
            <IconUploadList />
          </div>

          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-6">
            <div className="rounded-lg">
              <h2 className="text-base font-bold mb-2">Story</h2>
              <StoryTierInputFieldConfig />
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <SettingTierInputFieldConfig dynamicTierFields={dynamicTierFields} />
    </div>
  );
};

export default SettingTierAndStory;
