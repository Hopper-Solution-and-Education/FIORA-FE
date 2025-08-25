import * as yup from 'yup';
export const editThresholdTierSchema = yup.object({
  axis: yup.string().required('Axis is required'),
  oldMin: yup
    .number()
    .min(0, 'Old min must be positive')
    // .max(9999999999, 'Old min must be less than 100,000,000,000')
    .required('Old min is required'),
  oldMax: yup
    .number()
    .min(0, 'Old max must be positive')
    // .max(9999999999, 'Old max must be less than 100,000,000,000')
    .required('Old max is required'),
  newMin: yup
    .number()
    .min(0, 'New min must be positive')
    // .max(9999999999, 'New min must be less than 100,000,000,000')
    .required('New min is required'),
  newMax: yup
    .number()
    .min(0, 'New max must be positive')
    // .max(9999999999, 'New max must be less than 100,000,000,000')
    .required('New max is required'),
});

export type EditThresholdTierFormValues = yup.InferType<typeof editThresholdTierSchema>;

export const defaultEditThresholdTierValue: EditThresholdTierFormValues = {
  axis: 'balance',
  oldMin: 0,
  oldMax: 0,
  newMin: 0,
  newMax: 0,
};
