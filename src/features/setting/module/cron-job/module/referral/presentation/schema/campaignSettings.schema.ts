import * as yup from 'yup';

export const campaignSettingsSchema = yup.object({
  bonus_1st_amount: yup
    .number()
    .required('Bonus 1st amount is required')
    .min(0, 'Bonus 1st amount must be at least 0')
    .typeError('Bonus 1st amount must be a number'),
  minimumWithdrawal: yup
    .number()
    .required('Minimum withdrawal is required')
    .min(0, 'Minimum withdrawal must be at least 0')
    .typeError('Minimum withdrawal must be a number'),
  isActive: yup.boolean().required('Active status is required'),
});

export type CampaignSettingsFormValues = yup.InferType<typeof campaignSettingsSchema>;
