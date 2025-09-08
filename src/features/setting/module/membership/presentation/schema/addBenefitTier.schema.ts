import * as yup from 'yup';
import { ProcessMembershipMode } from '../../data/api';

export const addBenefitTierSchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup.string().required('Slug is required'),
  value: yup
    .number()
    .min(0, 'Value must be greater than 0')
    .positive('Value must be positive')
    .required('Value is required'),
  description: yup.string().nullable(),
  suffix: yup.string().required('Suffix is required'),
  mode: yup.string().required('Mode is required').oneOf(Object.values(ProcessMembershipMode)),
});

export type AddBenefitTierFormValues = yup.InferType<typeof addBenefitTierSchema>;

export const defaultAddBenefitTierValue: AddBenefitTierFormValues = {
  name: '',
  slug: '',
  value: 0,
  description: '',
  suffix: '',
  mode: ProcessMembershipMode.CREATE,
};
