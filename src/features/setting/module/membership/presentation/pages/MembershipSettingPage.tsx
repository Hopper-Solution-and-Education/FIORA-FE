'use client';

import SubmitButton from '@/components/common/atoms/SubmitButton';
import { removeFromFirebase, uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getListMembershipAsyncThunk } from '../../slices/actions/getMemberShipAsyncThunk';
import { upsertMembershipAsyncThunk } from '../../slices/actions/upsertMembershipAsyncThunk';
import { IconUploadList, MembershipRankChart, SettingTierAndStory } from '../molecules';
import {
  defaultEditMemberShipValue,
  EditMemberShipFormValues,
  editMemberShipSchema,
} from '../schema/editMemberShip.schema';

enum TierBenefitName {
  REFERRAL_BONUS = 'referral-bonus',
  SAVING_INTEREST = 'saving-interest',
  STAKING_INTEREST = 'staking-interest',
  INVESTMENT_INTEREST = 'investment-interest',
  LOAN_INTEREST = 'loan-interest',
  CASHBACK = 'cashback',
  REFERRAL_KICKBACK = 'referral-kickback',
  BNPL_FEE = 'bnpl-fee',
}

const MembershipSettingPage = () => {
  const dispatch = useAppDispatch();
  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);
  const methods = useForm<EditMemberShipFormValues>({
    resolver: yupResolver(editMemberShipSchema),
    defaultValues: defaultEditMemberShipValue,
  });

  const { setValue } = methods;

  useEffect(() => {
    dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    if (selectedMembership) {
      console.log(selectedMembership);
      setValue('id', selectedMembership.id);
      setValue('tier', selectedMembership.tierName);
      setValue('story', selectedMembership.story);
      setValue('activeIcon', selectedMembership.mainIconUrl);
      setValue('inActiveIcon', selectedMembership.inactiveIconUrl);
      setValue('mainIcon', selectedMembership.mainIconUrl);
      setValue('themeIcon', selectedMembership.themeIconUrl);
      setValue(
        'referralBonus',
        selectedMembership.tierBenefits.find(
          (benefit) => benefit.slug === TierBenefitName.REFERRAL_BONUS,
        )?.value ?? 0,
      );
      setValue(
        'savingInterest',
        selectedMembership.tierBenefits.find(
          (benefit) => benefit.slug === TierBenefitName.SAVING_INTEREST,
        )?.value ?? 0,
      );
      setValue(
        'stakingInterest',
        selectedMembership.tierBenefits.find(
          (benefit) => benefit.slug === TierBenefitName.STAKING_INTEREST,
        )?.value ?? 0,
      );
      setValue(
        'investmentInterest',
        selectedMembership.tierBenefits.find(
          (benefit) => benefit.slug === TierBenefitName.INVESTMENT_INTEREST,
        )?.value ?? 0,
      );
      setValue(
        'loanInterest',
        selectedMembership.tierBenefits.find(
          (benefit) => benefit.slug === TierBenefitName.LOAN_INTEREST,
        )?.value ?? 0,
      );
      setValue(
        'cashback',
        selectedMembership.tierBenefits.find((benefit) => benefit.slug === TierBenefitName.CASHBACK)
          ?.value ?? 0,
      );
      setValue(
        'referralKickback',
        selectedMembership.tierBenefits.find(
          (benefit) => benefit.slug === TierBenefitName.REFERRAL_KICKBACK,
        )?.value ?? 0,
      );
      setValue(
        'bnplFee',
        selectedMembership.tierBenefits.find((benefit) => benefit.slug === TierBenefitName.BNPL_FEE)
          ?.value ?? 0,
      );
    }
  }, [selectedMembership]);

  const handleSubmit = async (data: EditMemberShipFormValues) => {
    try {
      // Helper function to handle icon upload
      const uploadIconIfNeeded = async (iconUrl: string, tierName: string) => {
        if (iconUrl && iconUrl.startsWith('blob:')) {
          const response = await fetch(iconUrl);
          const blob = await response.blob();

          const fileName = `${tierName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
          const file = new File([blob], fileName, { type: blob.type });

          const firebaseUrl = await uploadToFirebase({
            file: file,
            path: 'images/membership_icons',
            fileName,
          });

          await removeFromFirebase(iconUrl);

          return firebaseUrl;
        }
        return iconUrl; // Return original URL if not a new blob or not provided
      };

      // Process each icon field
      const updatedActiveIcon = await uploadIconIfNeeded(data.activeIcon, data.tier);
      const updatedInActiveIcon = await uploadIconIfNeeded(data.inActiveIcon, data.tier);
      const updatedThemeIcon = await uploadIconIfNeeded(data.themeIcon, data.tier);
      const updatedMainIcon = await uploadIconIfNeeded(data.mainIcon, data.tier);
      // Create a new data object with updated icon URLs
      const updatedData = {
        ...data,
        activeIcon: updatedActiveIcon,
        inActiveIcon: updatedInActiveIcon,
        themeIcon: updatedThemeIcon,
        mainIcon: updatedMainIcon,
      };

      await dispatch(upsertMembershipAsyncThunk(updatedData));
    } catch (error: any) {
      toast.error('Failed to upsert membership', {
        description: error.message,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="edit-member-ship-form" onSubmit={methods.handleSubmit(handleSubmit)}>
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
            <IconUploadList />
          </div>

          {/* Footer Button */}
          <div className="mt-6 flex justify-end">
            <SubmitButton
              formState={methods.formState}
              isLoading={methods.formState.isSubmitting}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default MembershipSettingPage;
