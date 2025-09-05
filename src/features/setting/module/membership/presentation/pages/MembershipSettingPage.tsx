'use client';

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import {
  setIsShowDialogAddBenefitTier,
  setIsShowDialogEditThresholdBenefitTier,
} from '../../slices';
import { getListMembershipAsyncThunk } from '../../slices/actions';
import { useMembershipSettingPage } from '../hooks';
import { MembershipRankChart, SettingTierAndStory } from '../molecules';
import { DialogAddBenefitTier, DialogDeleteBenefitTier } from '../organisms';
import DialogEditBenefitTier from '../organisms/DialogEditBenefitTier';
import DialogEditThresholdBenefitTier from '../organisms/DialogEditThresholdBenefitTier';

const MembershipSettingPage = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const isShowDialogAddBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isShowDialogAddBenefitTier,
  );
  const isShowDialogEditThresholdBenefitTier = useAppSelector(
    (state) => state.memberShipSettings.isDialogEditThresholdBenefitOpen,
  );
  const { methods, handleSubmit, dynamicTierFields } = useMembershipSettingPage();

  // Add error handling for form submission
  const onError = (errors: any) => {
    toast.error('Error submit form', {
      description: errors.message,
    });
  };

  useEffect(() => {
    dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
  }, []);

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <form
          data-test="edit-member-ship-form"
          id="edit-member-ship-form"
          onSubmit={methods.handleSubmit(handleSubmit, onError)}
        >
          <div className={`min-h-screen ${isMobile ? '' : 'p-6'}`}>
            {/* Main container with two rows */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Section: Balance Graph col-3 */}
              <MembershipRankChart />
              {/* Right Section: Settings and Story col-2 */}
              <SettingTierAndStory dynamicTierFields={dynamicTierFields} />
            </div>
          </div>
        </form>
      </FormProvider>

      {/* Dialog Edit Benefit Tier */}
      <DialogEditBenefitTier />

      <DialogAddBenefitTier
        open={isShowDialogAddBenefitTier}
        onOpenChange={() => dispatch(setIsShowDialogAddBenefitTier(!isShowDialogAddBenefitTier))}
      />
      <DialogEditThresholdBenefitTier
        open={isShowDialogEditThresholdBenefitTier}
        onOpenChange={(open) => dispatch(setIsShowDialogEditThresholdBenefitTier(open))}
      />
      {/* Dialog Delete Benefit Tier */}
      <DialogDeleteBenefitTier />
    </React.Fragment>
  );
};

export default MembershipSettingPage;
