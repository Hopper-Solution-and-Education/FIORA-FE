'use client';

import { FormConfig, InputField } from '@/components/common/forms';
import { useFormContext } from 'react-hook-form';
import { SettingTierInputFieldConfig, StoryTierInputFieldConfig } from '../config';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const renderEmptySubmitButton = () => {
  return <></>;
};

const SettingTierAndStory = () => {
  const methods = useFormContext<EditMemberShipFormValues>();

  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 shadow rounded-lg">
      {/* Settings Panel */}
      <div className="p-4 ">
        <div className="flex justify-start items-start gap-4">
          <h2 className="sm:text-sm md:text-lg lg:text-xl font-bold mb-3 w-1/2">Setting Tier</h2>
          <div className="w-full">
            <FormConfig
              fields={[<InputField key="tier" name="tier" placeholder="Tier name" />]}
              methods={methods}
              renderSubmitButton={renderEmptySubmitButton}
            />
          </div>
        </div>

        <div className="max-w-2xl">
          <SettingTierInputFieldConfig />
        </div>
      </div>

      {/* Story Section */}
      <div className="p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Story</h2>
        <StoryTierInputFieldConfig />
      </div>
    </div>
  );
};

export default SettingTierAndStory;
