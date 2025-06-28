import { removeFromFirebase, uploadToFirebase } from '@/shared/lib';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { setSelectedMembership } from '../../slices';
import { getListMembershipAsyncThunk } from '../../slices/actions/getMemberShipAsyncThunk';
import { upsertMembershipAsyncThunk } from '../../slices/actions/upsertMembershipAsyncThunk';
import {
  defaultEditMemberShipValue,
  EditMemberShipFormValues,
  editMemberShipSchema,
} from '../schema/editMemberShip.schema';

export enum TierBenefitName {
  REFERRAL_BONUS = 'referral-bonus',
  SAVING_INTEREST = 'saving-interest',
  STAKING_INTEREST = 'staking-interest',
  INVESTMENT_INTEREST = 'investment-interest',
  LOAN_INTEREST = 'loan-interest',
  CASHBACK = 'cashback',
  REFERRAL_KICKBACK = 'referral-kickback',
  BNPL_FEE = 'bnpl-fee',
}

export const useMembershipSettingPage = () => {
  const dispatch = useAppDispatch();
  const methods = useForm<EditMemberShipFormValues>({
    resolver: yupResolver(editMemberShipSchema),
    defaultValues: defaultEditMemberShipValue,
  });

  const selectedMembership = useAppSelector((state) => state.memberShipSettings.selectedMembership);

  const { setValue } = methods;

  //   handle set value when selected membership change
  useEffect(() => {
    if (selectedMembership) {
      console.log('selectedMembership', selectedMembership);
      setValue('id', selectedMembership.id);
      setValue('tier', selectedMembership.tierName);
      setValue('story', selectedMembership.story);
      setValue('activeIcon', selectedMembership.passedIconUrl);
      setValue('inActiveIcon', selectedMembership.inactiveIconUrl);
      setValue('mainIcon', selectedMembership.mainIconUrl);
      setValue('themeIcon', selectedMembership.themeIconUrl);
      setValue(
        'referralBonus',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.REFERRAL_BONUS,
          )?.value ?? 0,
        ),
      );
      setValue(
        'savingInterest',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.SAVING_INTEREST,
          )?.value ?? 0,
        ),
      );
      setValue(
        'stakingInterest',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.STAKING_INTEREST,
          )?.value ?? 0,
        ),
      );
      setValue(
        'investmentInterest',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.INVESTMENT_INTEREST,
          )?.value ?? 0,
        ),
      );
      setValue(
        'loanInterest',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.LOAN_INTEREST,
          )?.value ?? 0,
        ),
      );
      setValue(
        'cashback',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.CASHBACK,
          )?.value ?? 0,
        ),
      );
      setValue(
        'referralKickback',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.REFERRAL_KICKBACK,
          )?.value ?? 0,
        ),
      );
      setValue(
        'bnplFee',
        Number(
          selectedMembership.tierBenefits.find(
            (benefit) => benefit.slug === TierBenefitName.BNPL_FEE,
          )?.value ?? 0,
        ),
      );
    }
  }, [selectedMembership, setValue]);

  //   handle submit form
  const handleSubmit = async (data: EditMemberShipFormValues) => {
    // Keep track of uploaded URLs to rollback on failure
    const uploadedUrls: string[] = [];

    const uploadIconIfNeeded = async (iconUrl: string, tierName: string): Promise<string> => {
      if (iconUrl && iconUrl.startsWith('blob:')) {
        const response = await fetch(iconUrl);
        const blob = await response.blob();

        const fileName = `${tierName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
        const file = new File([blob], fileName, { type: blob.type });

        const firebaseUrl = await uploadToFirebase({
          file,
          path: 'images/membership_icons',
          fileName,
        });

        // Track uploaded file for rollback if needed
        uploadedUrls.push(firebaseUrl);

        return firebaseUrl;
      }
      return iconUrl;
    };

    try {
      // upload icon if needed
      const [updatedActiveIcon, updatedInActiveIcon, updatedThemeIcon, updatedMainIcon] =
        await Promise.all([
          uploadIconIfNeeded(data.activeIcon, data.tier),
          uploadIconIfNeeded(data.inActiveIcon, data.tier),
          uploadIconIfNeeded(data.themeIcon, data.tier),
          uploadIconIfNeeded(data.mainIcon, data.tier),
        ]);

      // update data
      const updatedData = {
        ...data,
        activeIcon: updatedActiveIcon,
        inActiveIcon: updatedInActiveIcon,
        themeIcon: updatedThemeIcon,
        mainIcon: updatedMainIcon,
      };

      // handle update and then call get list to mapping data again, and then set selected membership
      dispatch(upsertMembershipAsyncThunk(updatedData))
        .unwrap()
        .then((response) => {
          // get list membership and then set selected membership
          dispatch(getListMembershipAsyncThunk({ page: 1, limit: 10 }))
            .unwrap()
            .then(() => {
              // then set selected membership
              const selectedMemberShip = response.data;
              dispatch(
                setSelectedMembership({
                  id: selectedMemberShip.id,
                  mainIconUrl: selectedMemberShip.mainIconUrl,
                  passedIconUrl: selectedMemberShip.passedIconUrl,
                  inactiveIconUrl: selectedMemberShip.inactiveIconUrl,
                  themeIconUrl: selectedMemberShip.themeIconUrl,
                  tierBenefits: selectedMemberShip.tierBenefits.map((benefit) => ({
                    ...benefit,
                    value: Number(benefit.value),
                  })),
                  story: selectedMemberShip.story,
                  tierName: selectedMemberShip.tierName,
                  balanceMaxThreshold: selectedMemberShip.balanceMaxThreshold,
                  balanceMinThreshold: selectedMemberShip.balanceMinThreshold,
                  spentMaxThreshold: selectedMemberShip.spentMaxThreshold,
                  spentMinThreshold: selectedMemberShip.spentMinThreshold,
                  createdAt: selectedMemberShip.createdAt,
                  updatedAt: selectedMemberShip.updatedAt,
                }),
              );
            })
            .catch(async (error) => {
              await Promise.all(uploadedUrls.map((url) => removeFromFirebase(url)));
              throw error;
            });
        })
        .catch(async (error) => {
          await Promise.all(uploadedUrls.map((url) => removeFromFirebase(url)));
          throw error;
        });
    } catch (error: any) {
      toast.error('Failed to upsert membership', {
        description:
          error.message || 'An image upload failed. All uploaded files have been removed.',
      });
    }
  };

  return { methods, handleSubmit };
};
