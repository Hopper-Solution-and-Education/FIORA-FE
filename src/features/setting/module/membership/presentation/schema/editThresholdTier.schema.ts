import * as yup from 'yup';

export const editThresholdTierSchema = yup.object({
  axis: yup.string().required('Axis is required'),
  oldMin: yup.number().min(0, 'Old min must be positive').required('Old min is required'),
  oldMax: yup
    .number()
    .min(0, 'Old max must be positive')
    .required('Old max is required')
    .test(
      'is-infinity-or-number',
      'Old max must be positive or Infinity',
      (value) => value === Infinity || (typeof value === 'number' && value >= 0),
    ),
  newMin: yup.number().min(0, 'New min must be positive').required('New min is required'),
  newMax: yup
    .number()
    .min(0, 'New max must be positive')
    .required('New max is required')
    .test(
      'is-infinity-or-number',
      'New max must be positive or Infinity',
      (value) => value === Infinity || (typeof value === 'number' && value >= 0),
    ),
});

export type EditThresholdTierFormValues = yup.InferType<typeof editThresholdTierSchema>;

export const defaultEditThresholdTierValue: EditThresholdTierFormValues = {
  axis: 'balance',
  oldMin: 0,
  oldMax: 0,
  newMin: 0,
  newMax: 0,
};
