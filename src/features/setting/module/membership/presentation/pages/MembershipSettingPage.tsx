'use client';

import SubmitButton from '@/components/common/atoms/SubmitButton';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { setIsShowDialogAddBenefitTier } from '../../slices';
import { getListMembershipAsyncThunk } from '../../slices/actions';
import { useMembershipSettingPage } from '../hooks';
import { IconUploadList, MembershipRankChart, SettingTierAndStory } from '../molecules';
import { DialogAddBenefitTier } from '../organisms';

const MembershipSettingPage = () => {
  const dispatch = useAppDispatch();
  const isLoadingUpsertMembership = useAppSelector(
    (state) => state.memberShipSettings.isLoadingUpsertMembership,
  );
  const isShowDialogAddBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isShowDialogAddBenefitTier,
  );

  const { methods, handleSubmit, dynamicTierFields } = useMembershipSettingPage();

  useEffect(() => {
    dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
  }, []);

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <form id="edit-member-ship-form" onSubmit={methods.handleSubmit(handleSubmit)}>
          <div className="min-h-screen p-6 ">
            {/* Main container with two rows */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Section: Balance Graph col-3 */}
              <MembershipRankChart />

              {/* Right Section: Settings and Story col-2 */}
              <SettingTierAndStory dynamicTierFields={dynamicTierFields} />
            </div>

            {/* Bottom Row: Icon Upload List */}
            <div className="mt-6">
              <IconUploadList />
            </div>

            {/* Footer Button */}
            <div className="flex justify-end">
              <SubmitButton
                isDisabled={isLoadingUpsertMembership}
                formState={methods.formState}
                isLoading={methods.formState.isSubmitting || isLoadingUpsertMembership}
              />
            </div>
          </div>
        </form>
      </FormProvider>
      <DialogAddBenefitTier
        open={isShowDialogAddBenefitTier}
        onOpenChange={() => dispatch(setIsShowDialogAddBenefitTier(!isShowDialogAddBenefitTier))}
      />
    </React.Fragment>
  );
};

export default MembershipSettingPage;
