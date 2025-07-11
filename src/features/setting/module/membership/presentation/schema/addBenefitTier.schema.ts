import * as yup from 'yup';

export const addBenefitTierSchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string().nullable(),
  suffix: yup.string().required('Suffix is required'),
});

export type AddBenefitTierFormValues = yup.InferType<typeof addBenefitTierSchema>;

export const defaultAddBenefitTierValue: AddBenefitTierFormValues = {
  name: '',
  slug: '',
  description: '',
  suffix: '',
};
