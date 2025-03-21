import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { iconOptions } from '@/shared/constants/data';
import * as yup from 'yup';

// Yup validation schema
const validateNewAccountSchema = yup.object({
  icon: yup.string().required('Please select an icon'),
  type: yup.string().required('Please select a type'),
  name: yup
    .string()
    .required('Account name is required')
    .min(2, 'Name must be at least 2 characters'),
  currency: yup.string().required('Please select a currency'),
  limit: yup.number().min(0, 'Limit must be greater than or equal to 0').notRequired(),
  balance: yup.number().min(0, 'Balance must be greater than or equal to 0').required(),
  parentId: yup.string().optional(),
});

const defaultNewAccountValues: NewAccountDefaultValues = {
  icon: iconOptions[0].options[0].value,
  type: ACCOUNT_TYPES.PAYMENT,
  name: '',
  currency: 'VND',
  limit: 0,
  balance: 0,
  parentId: '',
};

export { validateNewAccountSchema, defaultNewAccountValues };
export type NewAccountDefaultValues = yup.InferType<typeof validateNewAccountSchema>;
