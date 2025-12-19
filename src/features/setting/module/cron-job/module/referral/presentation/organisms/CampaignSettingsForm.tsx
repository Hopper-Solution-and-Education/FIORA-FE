'use client';

import { GlobalLabel } from '@/components/common/atoms';
import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { FormConfig, InputField } from '@/components/common/forms';
import SwitchField from '@/components/common/forms/switch/SwitchField';
import { Icons } from '@/components/Icon';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  getCampaignAsyncThunk,
  upsertCampaignAsyncThunk,
} from '../../slices/actions/campaignAsyncThunks';
import {
  CampaignSettingsFormValues,
  campaignSettingsSchema,
} from '../schema/campaignSettings.schema';

// Helper component for label with tooltip
const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <div className="flex items-center gap-2">
    <CommonTooltip content={tooltip}>
      <Icons.info className="h-3 w-3 text-muted-foreground hover:text-primary cursor-help transition-colors" />
    </CommonTooltip>
    <GlobalLabel text={label} htmlFor={label} required={true} className="mb-0" />
  </div>
);

const CampaignSettingsForm = ({ onBack }: { onBack: () => void }) => {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state) => state.referralCronjob.isSubmitting);
  const campaignSettings = useAppSelector((state) => state.referralCronjob.campaignSettings);

  // LOCAL STATE
  const hasFetchedRef = useRef(false);
  const isSubmittingRef = useRef(false);

  // FORM & HANDLERS
  const methods = useForm<CampaignSettingsFormValues>({
    resolver: yupResolver(campaignSettingsSchema),
    defaultValues: {
      bonus_1st_amount: 0,
      minimumWithdrawal: 0,
      isActive: true,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: CampaignSettingsFormValues) => {
    // Prevent spam submissions
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      await dispatch(upsertCampaignAsyncThunk(data)).unwrap();
    } catch (error) {
      console.error('Failed to update campaign settings:', error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // EFFECTS
  // Fetch campaign settings on mount (only once)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getCampaignAsyncThunk());
    }
  }, [dispatch]);

  // Reset form when campaign settings are loaded
  useEffect(() => {
    if (campaignSettings) {
      methods.reset({
        bonus_1st_amount: campaignSettings.bonus_1st_amount || 0,
        minimumWithdrawal: campaignSettings.minimumWithdrawal || 0,
        isActive: campaignSettings.isActive ?? true,
      });
    }
  }, [campaignSettings, methods]);

  // UI
  const fields = [
    <InputField
      key="bonus_1st_amount"
      name="bonus_1st_amount"
      type="number"
      label={
        <LabelWithTooltip
          label="Bonus 1st Amount"
          tooltip="The bonus amount awarded to users when their referee completes their first transaction"
        />
      }
      placeholder="e.g., 10"
      required
    />,
    <InputField
      key="minimumWithdrawal"
      name="minimumWithdrawal"
      type="number"
      label={
        <LabelWithTooltip
          label="Minimum Withdrawal"
          tooltip="The minimum amount required before users can withdraw their referral bonuses"
        />
      }
      placeholder="e.g., 100"
      required
    />,
    <SwitchField
      key="isActive"
      name="isActive"
      label={
        <LabelWithTooltip
          label="Campaign Active"
          tooltip="Enable or disable the entire referral campaign. When disabled, no new bonuses will be awarded"
        />
      }
      activeLabel="Active"
      inactiveLabel="Inactive"
    />,
  ];

  return (
    <Fragment>
      <div className="border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm bg-card">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                Referral Campaign Settings
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure referral campaign bonus and withdrawal settings
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          data-test="campaign-settings-form"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormConfig
            methods={methods}
            fields={fields}
            showSubmitButton
            onBack={onBack}
            gridLayout
            gridCols={1}
            gridGap="gap-6"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default CampaignSettingsForm;
