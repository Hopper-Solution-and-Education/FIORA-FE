'use client';

import SubmitButton from '@/components/common/atoms/SubmitButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  IconUploadItem,
  IconUploadList,
  MembershipRankChart,
  SettingTierAndStory,
} from '../molecules';
import {
  defaultEditMemberShipValue,
  EditMemberShipFormValues,
  editMemberShipSchema,
} from '../schema/editMemberShip.schema';

const MembershipSettingPage = () => {
  const methods = useForm<EditMemberShipFormValues>({
    resolver: yupResolver(editMemberShipSchema),
    defaultValues: defaultEditMemberShipValue,
  });
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
    <FormProvider {...methods}>
      <div className="min-h-screen p-6 ">
        {/* Main container with two rows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
          <SubmitButton formState={methods.formState} isLoading={methods.formState.isSubmitting} />
        </div>
      </div>
    </FormProvider>
  );
};

export default MembershipSettingPage;
