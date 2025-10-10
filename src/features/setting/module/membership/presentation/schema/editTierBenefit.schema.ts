import * as yup from 'yup';
import { ProcessMembershipMode } from '../../data/api';

export const editTierBenefitSchema = yup.object({
  name: yup.string().required('Name is required'),
  value: yup
    .number()
    .min(0, 'Value must be greater than 0')
    .positive('Value must be positive')
    .required('Value is required'),
  description: yup.string().nullable(),
  unit: yup.string().required('Unit is required'),
  mode: yup.string().required('Mode is required').oneOf(Object.values(ProcessMembershipMode)),
});

export type EditTierBenefitFormValues = yup.InferType<typeof editTierBenefitSchema>;

export const defaultEditTierBenefitValue: EditTierBenefitFormValues = {
  name: '',
  value: 0,
  description: '',
  unit: '',
  mode: ProcessMembershipMode.UPDATE,
};
