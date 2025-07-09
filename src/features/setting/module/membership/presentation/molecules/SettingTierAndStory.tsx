'use client';

import { FormConfig, InputField, UploadImageField } from '@/components/common/forms';
import { useAppSelector } from '@/store';
import { useFormContext } from 'react-hook-form';
import { SettingTierInputFieldConfig, StoryTierInputFieldConfig } from '../config';
import { EditMemberShipFormValues } from '../schema/editMemberShip.schema';

const renderEmptySubmitButton = () => {
  return <></>;
};

const SettingTierAndStory = ({
  dynamicTierFields,
}: {
  dynamicTierFields: { key: string; label: string; suffix?: string }[];
}) => {
  const methods = useFormContext<EditMemberShipFormValues>();

  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );

  const renderMainIcon = () => {
    return (
      <UploadImageField
        name="mainIcon"
        label="Main Icon"
        required
        disabled={isLoadingUpsertMembership}
      />
    );
  };

  return (
    <div className="space-y-6 col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5 shadow rounded-lg">
      {/* Settings Panel */}
      <div className="p-4">
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

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-5">
            <FormConfig
              fields={[renderMainIcon()]}
              methods={methods}
              renderSubmitButton={renderEmptySubmitButton}
            />
          </div>

          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-7">
            <SettingTierInputFieldConfig dynamicTierFields={dynamicTierFields} />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Story</h2>
        <StoryTierInputFieldConfig />
      </div>
    </div>
  );
};

export default SettingTierAndStory;
