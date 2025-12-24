import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import type { IReferralCronjobDashboardApi } from '../../data/api/IReferralCronjobDashboardApi';
import { referralCronjobContainer } from '../../di/referralCronjobDashboardDI';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';
import { CampaignSettings } from '../../presentation/types/referral.type';
import { setCampaignSettings, setSubmitting } from '../index';

export const getCampaignAsyncThunk = createAsyncThunk(
  'referralCronjob/getCampaign',
  async (_, { dispatch }) => {
    try {
      const api = referralCronjobContainer.get<IReferralCronjobDashboardApi>(
        REFERRAL_CRONJOB_TYPES.IReferralCronjobDashboardApi,
      );

      const response = await api.getCampaign();

      // Update Redux state with fetched settings
      if (response?.data?.dynamicValue) {
        dispatch(setCampaignSettings(response.data.dynamicValue));
      }

      return response;
    } catch (error: any) {
      console.error(
        'src/features/setting/module/cron-job/module/referral/slices/actions/campaignAsyncThunks.ts: getCampaignAsyncThunk error',
        error,
      );
      return null;
    }
  },
);

export const upsertCampaignAsyncThunk = createAsyncThunk(
  'referralCronjob/upsertCampaign',
  async (data: CampaignSettings, { dispatch }) => {
    try {
      dispatch(setSubmitting(true));

      const api = referralCronjobContainer.get<IReferralCronjobDashboardApi>(
        REFERRAL_CRONJOB_TYPES.IReferralCronjobDashboardApi,
      );

      const response = await api.upsertCampaign(data);

      // Update Redux state with new settings
      dispatch(setCampaignSettings(data));

      toast.success(response?.message || 'Campaign settings updated successfully', {
        description: 'Your changes have been saved',
      });

      return response;
    } catch (error: any) {
      toast.error('Failed to update campaign settings', {
        description: error?.message || 'Please try again',
      });
      throw error;
    } finally {
      dispatch(setSubmitting(false));
    }
  },
);
