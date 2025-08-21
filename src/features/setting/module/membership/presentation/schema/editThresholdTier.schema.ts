import * as yup from 'yup';
export const editThresholdTierSchema = yup.object({
  axis: yup.string().required('Axis is required'),
  oldMin: yup.number().required('Old min is required'),
  oldMax: yup.number().required('Old max is required'),
  newMin: yup.number().required('New min is required'),
  newMax: yup.number().required('New max is required'),
});

export type EditThresholdTierFormValues = yup.InferType<typeof editThresholdTierSchema>;

export const defaultEditThresholdTierValue: EditThresholdTierFormValues = {
  axis: 'balance',
  oldMin: 0,
  oldMax: 0,
  newMin: 0,
  newMax: 0,
};
